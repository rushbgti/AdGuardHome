const path = require('path');
const fs = require('fs');
const request = require('request-promise');
const twoskyConfig = require('../../.twosky.json')[0];

const { project_id: TWOSKY_PROJECT_ID, base_locale: DEFAULT_LANGUAGE } = twoskyConfig;
const LOCALES_DIR = '../../client/src/__locales';
const BASE_FILE = 'en.json';
const TWOSKY_URI = process.env.TWOSKY_URI;

/**
 * Prepare post params
 */
const getRequestData = (url, projectId) => {
    const language = process.env.UPLOAD_LANGUAGE || DEFAULT_LANGUAGE;
    const formData = {
        format: 'json',
        language: language,
        filename: BASE_FILE,
        project: projectId,
        file: fs.createReadStream(path.resolve(LOCALES_DIR, `${language}.json`)),
    };

    console.log(`uploading ${language}`);

    return {
        url: `${url}/upload`,
        formData
    };
};

/**
 * Make request to twosky to upload new json
 */
const upload = () => {
    if (!TWOSKY_URI) {
        console.error('No credentials');
        return;
    }

    const { url, formData } = getRequestData(TWOSKY_URI, TWOSKY_PROJECT_ID);
    request
        .post({ url, formData })
        .catch(err => console.log(err));
};

upload();
