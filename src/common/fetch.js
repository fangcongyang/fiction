let queryString = require('query-string');
import {Platform} from 'react-native';
import evn from '../utils/common';

const os = Platform.OS;

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  } else {
    throw new Error('请求接口失败!');
  }
}

function parseJSON(data) {
  if (data.data && data.data.records) {
    data.data.records.forEach(value => {
      if (value.logo) {
        value.logo = evn.baseUrl + value.logo;
      }
    });
  } else if (data.data) {
    let dataOne = data.data;
    if (dataOne.logo) {
      dataOne.logo = evn.baseUrl + dataOne.logo;
    } else if (Array.isArray(dataOne)) {
      dataOne.forEach(value => {
        if (value.logo) {
          value.logo = evn.baseUrl + value.logo;
        }
      })
    }
  } 
  return data;
}
async function get(url, params) {
  url = evn.fetchUrl + url;
  if (params) {
    url += `?${queryString.stringify(params)}`;
  }
  try {
    return Promise.race([fetch(url, {
      header: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }),new Promise(function(resolve,reject){
      setTimeout(()=> reject(new Error('请求超时!')),15000)
    })])
      .then(checkStatus)
      .then(parseJSON);
  } catch (e) {
    throw new Error('请求接口失败!');
  }
}

async function post(url, body) {
  let fetchOptions = {
    method: 'POST',
    body: body,
  };
  
  url = evn.fetchUrl + url;
  return Promise.race([fetch(url, fetchOptions).then(checkStatus).then(parseJSON),new Promise(function(resolve,reject){
    setTimeout(()=> reject(new Error('请求超时!')),15000)
  })]);
}

async function del(url, params) {
  if (params) {
    url += `?${queryString.stringify(params)}`;
  }
  let fetchOptions = {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      UserAgent: os,
    },
  };
  url = evn.fetchUrl + url;
  return fetch(url, fetchOptions)
    .then(checkStatus)
    .then(parseJSON);
}

async function update(url, body) {
  let fetchOptions = {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      UserAgent: os,
    },
    body: JSON.stringify(body),
  };
  return fetch(url, fetchOptions)
    .then(checkStatus)
    .then(parseJSON);
}

async function uploadFile(url, params, fileUrl, fileName) {
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
