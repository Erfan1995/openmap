import { message } from "antd";
import { API, DATASET } from "../static/constant"
import nookies from "nookies";
const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
const mapboxUrl = process.env.NEXT_PUBLIC_MAPBOX_API_URL;
export const fetchApi = async (url) => {
  const res = await fetch(`${mapboxUrl}/${url}?access_token=${mapboxToken}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  const json = await res.json()
  if (json.errors) {
    throw new Error(API.FAILED_TO_FETCH_API)
  }
  return json;
};

async function fetchAPIGraphQl(query, { variables } = {}, tokenPar = null, needToken = true) {
  const res = await fetch(`${strapiUrl}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: needToken ? `Bearer ${!tokenPar ? token : tokenPar}` : ''
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const json = await res.json()
  if (json.errors) {
    console.error(json.errors)
    throw new Error('Failed to fetch API')
  }

  return json.data
}

export async function getMaps(userId, token) {
  try {
    const data = await fetchAPIGraphQl(`
  query Posts($where: JSON)
      {
        maps(where: $where) {
          title,
          type,
          description,
          id,
          styleId,
          updated_at,
          mapId,
          tags{
            id,
            name
          }
        }
      }`,
      {
        variables: {
          where: userId
        }
      }, token);
    return data.maps;
  } catch (e) {
    return e.message
  }
}

export async function getDatasets(userId, token) {
  try {
    const data = await fetchAPIGraphQl(`
  query Posts($where: JSON)
      {
        datasets(where: $where) {
          title,
          is_locked,
          maps{
            title,
            type
          },
          updated_at,
          id
        }
      }`,
      {
        variables: {
          where: userId
        }
      }, token);
    return data.datasets;
  } catch (e) {
    return { error: e.message }
  }
}

export async function getDatasetDetails(datasetId) {
  const { token } = nookies.get();
  try {
    const data = await fetchAPIGraphQl(`
  query Posts($where: JSON)
      {
        datasetcontents(where: $where) {
          id,
          properties
        }
      }`,
      {
        variables: {
          where: datasetId
        },
      }, token);
    return data.datasetcontents;
  } catch (e) {
    return { error: e.message }
  }
}
export async function getTags(token) {
  try {
    const data = await fetchAPIGraphQl(`
  query Posts
      {
        tags {
          id,
          name,
        }
      }`,
      {
        variables: {},
      }, token);
    return data.tags;
  } catch (e) {
    return { error: e.message }
  }
}
export async function getMMDCustomers(customerId, token) {
  try {
    const data = await fetchAPIGraphQl(`
  query Posts($where: JSON)
      {
        mmdcustomers(where: $where) {
          title,
          map{
            title
          },
          is_approved,
          updated_at
          id
        }
      }`,
      {
        variables: {
          where: customerId
        }
      }, token);
    return data.mmdcustomers;
  } catch (e) {
    return { error: e.message }
  }
}
export async function getMethod(url, tokenPar = null, needToken = true) {
  const { token } = nookies.get();
  const res = await fetch(`${strapiUrl}/${url}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: needToken ? `Bearer ${!tokenPar ? token : tokenPar}` : ''
    },
  }).catch((err) => {
    throw API.FAILED_TO_FETCH;
  })

  const json = await res.json()
  if (json.error) {
    throw json.error
  }

  return json;
}
export async function deleteMethod(url, needToken = true) {
  const { token } = nookies.get();
  const res = await fetch(`${strapiUrl}/${url}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: needToken ? `Bearer ${token}` : ''
    },
  }).catch((err) => {
    throw API.FAILED_TO_FETCH;
  })
  const json = await res.json()
  if (json.statusCode === 400) {
    throw json?.message[0]?.messages[0]?.message;
  } else if (json.statusCode === 500) {
    throw API.SERVER_SIDE_PROBLEM;
  }

  return json;
}
export async function postMethod(url, data, needToken = true) {
  const { token } = nookies.get();
  const res = await fetch(`${strapiUrl}/${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: needToken ? `Bearer ${token}` : ''
    },
    body: JSON.stringify(data),
  }).catch((err) => {
    throw API.FAILED_TO_FETCH;
  })
  const json = await res.json()
  if (json.statusCode === 400) {
    throw json?.message[0]?.messages[0]?.message;
  } else if (json.statusCode === 500) {
    throw API.SERVER_SIDE_PROBLEM;
  }

  return json;
}

export async function postFileMethod(url, data, needToken = true) {
  const { token } = nookies.get();
  const res = await fetch(`${strapiUrl}/${url}`, {
    method: 'POST',
    headers: {
      // 'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: needToken ? `Bearer ${token}` : ''
    },
    body: data,
  }).catch((err) => {
    throw API.FAILED_TO_FETCH;
  })
  const json = await res.json()
  if (json.statusCode === 400) {
    throw json?.message[0]?.messages[0]?.message;
  } else if (json.statusCode === 500) {
    throw API.SERVER_SIDE_PROBLEM;
  }

  return json;
}

export async function putFileMethod(url, data, needToken = true) {

  const { token } = nookies.get();
  const res = await fetch(`${strapiUrl}/${url}`, {
    method: 'PUT',
    headers: {
      // 'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: needToken ? `Bearer ${token}` : ''
    },
    body: data
  }).catch((err) => {
    throw API.FAILED_TO_FETCH;
  })
  const json = await res.json()
  if (json.statusCode === 400) {
    throw json?.message[0]?.messages[0]?.message;
  } else if (json.statusCode === 500) {
    throw API.SERVER_SIDE_PROBLEM;
  }

  return json;
}
export async function putMethod(url, data, needToken = true) {
  const { token } = nookies.get();
  const res = await fetch(`${strapiUrl}/${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: needToken ? `Bearer ${token}` : ''
    },
    body: JSON.stringify(data)
  }).catch((err) => {
    throw API.FAILED_TO_FETCH;
  })
  const json = await res.json()
  if (json.statusCode === 400) {
    throw json?.message[0]?.messages[0]?.message;
  } else if (json.statusCode === 500) {
    throw API.SERVER_SIDE_PROBLEM;
  }

  return json;
}
export function getStrapiURL(path) {
  return `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${path}`;
}
