const FORM_NAME = process.env.NETLIFY_APPRECIATION_FORM_NAME || 'student-appreciation';
const SITE_ID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID || '';
const AUTH_TOKEN = process.env.NETLIFY_AUTH_TOKEN || '';

const json = (statusCode, body, extraHeaders = {}) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=600',
    ...extraHeaders
  },
  body: JSON.stringify(body)
});

const fetchJson = async url => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${AUTH_TOKEN}`,
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Netlify API request failed (${response.status}): ${text}`);
  }

  return response.json();
};

const inferMediaKind = value => {
  const lower = String(value || '').toLowerCase();
  if (/\.(mp4|mov|webm|m4v|ogg)(\?|$)/.test(lower)) {
    return 'video';
  }
  return 'image';
};

const getMediaItems = data => {
  const mediaFields = ['photo_1', 'photo_2', 'photo_3', 'video_1'];

  return mediaFields.flatMap(fieldName => {
    const rawValue = data[fieldName];
    if (!rawValue) return [];

    const values = Array.isArray(rawValue) ? rawValue : [rawValue];

    return values
      .filter(value => typeof value === 'string' && value.trim())
      .map(value => ({
        kind: fieldName.startsWith('video') ? 'video' : inferMediaKind(value),
        url: value
      }));
  });
};

const normalizeEntry = submission => {
  const data = submission.data || {};

  return {
    id: submission.id,
    createdAt: submission.created_at,
    name: data.name || submission.name || 'Anonymous',
    headline: data.headline || submission.title || 'Untitled appreciation',
    batch: data.batch || '',
    relationship: data.relationship || '',
    memoryPlace: data.memory_place || '',
    message: data.message || submission.body || submission.summary || '',
    media: getMediaItems(data)
  };
};

exports.handler = async event => {
  if (event.httpMethod !== 'GET') {
    return json(405, { message: 'Method not allowed.' }, { Allow: 'GET' });
  }

  if (!AUTH_TOKEN || !SITE_ID) {
    return json(503, {
      message: 'The appreciation wall is waiting for Netlify API credentials before public memories can be loaded.'
    });
  }

  try {
    const formsUrl = `https://api.netlify.com/api/v1/sites/${encodeURIComponent(SITE_ID)}/forms`;
    const forms = await fetchJson(formsUrl);
    const form = forms.find(item => item.name === FORM_NAME);

    if (!form) {
      return json(200, {
        entries: [],
        message: `No form named "${FORM_NAME}" was found for this site yet.`
      });
    }

    const submissionsUrl = `https://api.netlify.com/api/v1/forms/${encodeURIComponent(form.id)}/submissions?per_page=100`;
    const submissions = await fetchJson(submissionsUrl);

    const entries = submissions
      .map(normalizeEntry)
      .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));

    return json(200, { entries });
  } catch (error) {
    return json(500, {
      message: 'Unable to load public appreciations right now.',
      details: error.message
    });
  }
};
