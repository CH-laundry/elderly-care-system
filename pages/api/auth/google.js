// pages/api/auth/google.js
export default function handler(req, res) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri =
    process.env.NODE_ENV === 'production'
      ? 'https://你的正式網域/api/auth/google/callback'
      : 'http://localhost:3000/api/auth/google/callback';

  const scope = [
    'openid',
    'email',
    'profile',
  ].join(' ');

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');

  res.writeHead(302, { Location: authUrl.toString() });
  res.end();
}
