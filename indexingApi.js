// file: indexingApi.js
const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');

const KEY_FILE_PATH = './jrtinker-indexing-424136630736.json'; // The JSON key you downloaded
const SCOPES = ['https://www.googleapis.com/auth/indexing'];

async function notifyGoogle(url, type = 'URL_UPDATED') {
  try {
    const auth = new GoogleAuth({
      keyFile: KEY_FILE_PATH,
      scopes: SCOPES,
    });

    const client = await auth.getClient();
    const accessToken = (await client.getAccessToken()).token;

    const response = await axios.post(
      'https://indexing.googleapis.com/v3/urlNotifications:publish',
      {
        url: url,
        type: type, // 'URL_UPDATED' or 'URL_DELETED'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    console.log(`✅ Indexing API success for ${url}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`❌ Indexing API error for ${url}:`, error.response ? error.response.data : error.message);
  }
}

// --- Example Usage ---
// Call this function right after you publish a new course or blog post in your admin panel.

// const newCourseUrl = 'https://jrtinker.com/courses/new-amazing-course';
// notifyGoogle(newCourseUrl);

// const updatedBlogUrl = 'https://jrtinker.com/blog/updated-article';
// notifyGoogle(updatedBlogUrl);