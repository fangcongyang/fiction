let queryString = require('query-string');
import {getItem} from './LocalStorageUtils';
import {Platform} from 'react-native';
import evn from '../utils/common';

const os = Platform.OS;

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  } else {
    let error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
}
function parseJSON(data) {
  if (data.data.records) {
    data.data.records.forEach(value => {
      if (value.logo) {
        value.logo = evn.baseUrl + value.logo;
      }
    });
    return data.data;
  } else {
    let dataOne = data.data;
    if (dataOne.logo) {
      dataOne.logo = evn.baseUrl + dataOne.logo;
    }
    return dataOne;
  }
}
async function get(url, params) {
  url = evn.fetchUrl + url;
  if (params) {
    url += `?${queryString.stringify(params)}`;
  }
  try {
    return fetch(url, {
      header: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(checkStatus)
      .then(parseJSON);
  } catch (e) {
    throw new Error('get error');
  }
}

async function post(url, body) {
  let Access_Token = await getItem('Access_Token');
  let fetchOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      Access_Token: Access_Token ? Access_Token : '',
      UserAgent: os,
    },
    body: JSON.stringify(body),
  };
  return fetch(url, fetchOptions)
    .then(checkStatus)
    .then(parseJSON);
}

async function del(url, params) {
  if (params) {
    url += `?${queryString.stringify(params)}`;
  }
  let Access_Token = await getItem('Access_Token');
  let fetchOptions = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Access_Token: Access_Token ? Access_Token : '',
      UserAgent: os,
    },
  };
  return fetch(url, fetchOptions)
    .then(checkStatus)
    .then(parseJSON);
}

async function update(url, body) {
  let Access_Token = await getItem('Access_Token');
  let fetchOptions = {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Access_Token: Access_Token ? Access_Token : '',
      UserAgent: os,
    },
    body: JSON.stringify(body),
  };
  return fetch(url, fetchOptions)
    .then(checkStatus)
    .then(parseJSON);
}

async function uploadFile(url, params, fileUrl, fileName) {
  let Access_Token = await getItem('Access_Token');
  let data = new FormData();
  data.append('file', {
    uri: fileUrl,
    name: fileName,
    type: 'image/jpeg',
  });

  Object.keys(params).forEach(key => {
    if (params[key] instanceof Date) {
      data.append(key, value.toISOString());
    } else {
      data.append(key, String(params[key]));
    }
  });
  const fetchOptions = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Access_Token: Access_Token ? Access_Token : '',
      UserAgent: os,
    },
    body: data,
  };
  return fetch(url, fetchOptions)
    .then(checkStatus)
    .then(parseJSON);
}
export default {
  get,
  post,
  del,
  update,
  uploadFile,
};
