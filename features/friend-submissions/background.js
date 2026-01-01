const CF_API_BASE = 'https://codeforces.com/api';

async function sha512(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-512', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateRand() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function getApiCredentials() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['cfApiKey', 'cfApiSecret'], (result) => {
      resolve({
        apiKey: result.cfApiKey || '',
        apiSecret: result.cfApiSecret || ''
      });
    });
  });
}

async function buildAuthenticatedUrl(method, params = {}) {
  const { apiKey, apiSecret } = await getApiCredentials();
  
  if (!apiKey || !apiSecret) {
    throw new Error('API credentials not configured. Click the extension icon to set them up.');
  }
  
  const rand = generateRand();
  const time = Math.floor(Date.now() / 1000);
  
  params.apiKey = apiKey;
  params.time = time;
  
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  const toHash = `${rand}/${method}?${sortedParams}#${apiSecret}`;
  const hash = await sha512(toHash);
  const apiSig = `${rand}${hash}`;
  
  return `${CF_API_BASE}/${method}?${sortedParams}&apiSig=${apiSig}`;
}

async function fetchFriends() {
  const url = await buildAuthenticatedUrl('user.friends', { onlyOnline: 'false' });
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.status !== 'OK') {
    throw new Error(data.comment || 'Failed to fetch friends');
  }
  
  return data.result;
}

async function fetchUserInfoBatch(handles) {
  const url = `${CF_API_BASE}/user.info?handles=${handles.join(';')}`;
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.status !== 'OK') {
    return {};
  }
  
  const ratingsMap = {};
  for (const user of data.result) {
    ratingsMap[user.handle.toLowerCase()] = user.rating || 0;
  }
  return ratingsMap;
}

async function fetchContestSubmissions(contestId, handle) {
  const url = `${CF_API_BASE}/contest.status?contestId=${contestId}&handle=${handle}`;
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.status !== 'OK') {
    return [];
  }
  
  return data.result;
}

function filterSubmissionsForProblem(submissions, problemIndex) {
  return submissions.filter(sub => {
    const matchesProblem = sub.problem.index.toUpperCase() === problemIndex.toUpperCase();
    const isAccepted = sub.verdict === 'OK';
    return matchesProblem && isAccepted;
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getFriendsSubmissions(contestId, problemIndex) {
  const friends = await fetchFriends();
  
  if (friends.length === 0) {
    return [];
  }
  
  const ratingsMap = await fetchUserInfoBatch(friends);
  
  const results = [];
  const batchSize = 5;
  
  for (let i = 0; i < friends.length; i += batchSize) {
    const batch = friends.slice(i, i + batchSize);
    
    const submissionPromises = batch.map(async (handle) => {
      try {
        const submissions = await fetchContestSubmissions(contestId, handle);
        const problemSubmissions = filterSubmissionsForProblem(submissions, problemIndex);
        
        if (problemSubmissions.length > 0) {
          const latestSubmission = problemSubmissions[0];
          return {
            handle,
            submission: latestSubmission,
            rating: ratingsMap[handle.toLowerCase()] || 0
          };
        }
      } catch (e) {
        console.error(`Error fetching submissions for ${handle}:`, e);
      }
      return null;
    });

    const settled = await Promise.all(submissionPromises);
    
    for (const result of settled) {
      if (result) {
        results.push(result);
      }
    }
    
    if (i + batchSize < friends.length) {
      await delay(200);
    }
  }

  results.sort((a, b) => b.rating - a.rating);
  
  return results;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_FRIENDS_SUBMISSIONS') {
    const { contestId, problemIndex } = request;
    
    getFriendsSubmissions(contestId, problemIndex)
      .then(data => sendResponse({ success: true, data }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    
    return true;
  }
});

