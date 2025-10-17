const express = require('express');
const axios = require('axios');
const moment = require('moment');

const app = express();
const port = process.env.PORT || 8080; // Codespaces forwards 8080 by default
const host = '0.0.0.0'; // Required for Codespaces

app.set('view engine', 'ejs');
app.use(express.static('public'));

const threadUrl = 'https://www.reddit.com/r/OpenAI/comments/1nz31om/new_sora_2_invite_code_megathread/.json';

async function fetchComments() {
  try {
    const response = await axios.get(threadUrl);
    const comments = response.data[1].data.children
      .map(child => {
        const { body, author, created_utc, id } = child.data;
        return {
          body,
          author,
          created: moment.unix(created_utc).fromNow(),
          id,
          created_utc
        };
      })
      // Sort newest first
      .sort((a, b) => b.created_utc - a.created_utc);
    return comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

app.get('/', async (req, res) => {
  const comments = await fetchComments();
  res.render('index', { comments });
});

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
