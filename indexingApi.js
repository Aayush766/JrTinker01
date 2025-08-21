require("dotenv").config();
const { GoogleAuth } = require("google-auth-library");
const axios = require("axios");

const SCOPES = ["https://www.googleapis.com/auth/indexing"];

async function notifyGoogle(url, type = "URL_UPDATED") {
  try {
    // Load service account JSON from environment variable
    const serviceAccount = JSON.parse(process.env.GCP_SERVICE_ACCOUNT_JSON);

    const auth = new GoogleAuth({
      credentials: serviceAccount,
      scopes: SCOPES,
    });

    const client = await auth.getClient();
    const accessToken = (await client.getAccessToken()).token;

    const response = await axios.post(
      "https://indexing.googleapis.com/v3/urlNotifications:publish",
      {
        url,
        type, // 'URL_UPDATED' or 'URL_DELETED'
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log(`✅ Indexing API success for ${url}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(
      `❌ Indexing API error for ${url}:`,
      error.response ? error.response.data : error.message
    );
  }
}

module.exports = { notifyGoogle };
