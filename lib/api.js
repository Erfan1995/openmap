
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
  const { token } = nookies.get();
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

export async function getWidgets(mdcId, token) {
  try {

    const data = await fetchAPIGraphQl(`
      query
        {
          widgets(where: {mapdatasetconf: ${mdcId}}){
           id,
           text{
             title,
             color,
             description,
           },
           video{
            title,
            color,
            video_link
           },
           progressbars{
            id,
            title,
            hover_text,
            is_active,
            icon{
              url
            }
           },
           news_feeds{
            title,
            color,
            rss_feed
           },
           mapdatasetconf{
            id
          }
        }
      }`,
      {
        variables: {
        
        }
      }, token);
    return data?.widgets;
  } catch (e) {
    return { error: e.message }
  }
}


export async function getCustomers(userId, token) {
  try {
    const data = await fetchAPIGraphQl(`
   query Posts($where: JSON)
      {
        users(where: $where,sort: " updated_at:desc") {
          username,
          email,
          id,
          updated_at,
        }
      }`,
      {
        variables: {
          where: userId
        }
      }, token);
    return data.users;
  } catch (e) {
    return e.message
  }
}
export async function getMaps(userId, token) {
  try {
    const data = await fetchAPIGraphQl(`
  query Posts($where: JSON)
      {
        maps(where: $where,sort: " updated_at:desc") {
          title,
          type,
          description,
          id,
          updated_at,
          mapstyle{
            id,
            link
          },
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
export async function getMapAnalytics(userId, token) {
  try {
    const data = await fetchAPIGraphQl(`
  query Posts($where: JSON)
      {
        maps(where: $where) {
          title,
          created_at
          updated_at,
          description,
          logo{
            url
          },
          visits,
          mmdpublicusers{
            id
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
export async function getUsersByMap(userId, token) {
  try {
    const data = await fetchAPIGraphQl(`
  query Posts($where: JSON)
      {
        maps(where: $where) {
          id,
          title,
          visits,
          auth_attributes,
          public_users{
            id,
            name,
            maps{
              id
            },
            map_attributes{
              id,
              attribute
            },
            trust_score,
            publicAddress,
            updated_at,
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
export async function getMapAttributes(condition, token = null, status = null) {
  try {
    const data = await fetchAPIGraphQl(`
  query Posts($where: JSON)
      {
        mapAttributes(where: $where) {
          id,
          attribute
        }
      }`,
      {
        variables: {
          where: condition
        }
      }, token, status);
    return data.mapAttributes;
  } catch (e) {
    return e.message
  }
}
export async function getMapVisits(mapId, token = null, status = null) {
  try {
    const data = await fetchAPIGraphQl(`
  query Posts($where: JSON)
      {
        maps(where: $where) {
          visits
        }
      }`,
      {
        variables: {
          where: mapId
        }
      }, token, status);
    return data.maps[0];
  } catch (e) {
    return e.message
  }
}


export async function getOneMap(id, token = null, status = null) {
  try {
    const data = await fetchAPIGraphQl(`
  query Posts($where: JSON)
      {
        maps(where: $where) {
          title,
          type,
          dialog_title,
          auth_types,
          auth_attributes,
          description,
          id,
         logo{
           url
         },
          mapstyle{
            id,
            link
          },
          updated_at,
          mapId,
          subtitle,
          zoomLevel,
          center,
          link,
          tags{
            id,
            name
          },
          surveys {
            id,
            forms,
            mmdcustomers{
              id,
              geometry,
              properties,
              is_approved,
              icon{
                id,
                icon{
                  id,
                  url
                }
              },
            },
            mmdpublicusers{
              id,
              properties,
              geometry,
              is_approved,
              public_user{
                publicAddress
              },
             
              icon{
                id,
                icon{
                  id,
                  url
                }
              },
            },
          },
          mmdcustomers{
            id,
            geometry,
            properties,
            is_approved,
            icon{
              id,
              icon{
                id,
                url
              }
            },
          },
          mmdpublicusers{
            id,
            properties,
            geometry,
            is_approved,
            public_user{
              publicAddress
            },
            icon{
              id,
              icon{
                id,
                url
              }
            },
          },
          mapdatasetconfs{
            default_popup_style_slug,
            selected_dataset_properties,
            edited_dataset_properties,
            icon{
              id,
              icon{
                id,
                url
              }
            },
            dataset{
              id
            }
          },
          mapsurveyconfs{
            default_popup_style_slug,
            selected_survey_properties,
            edited_survey_properties,
            icons{
              id,
              icon{
                id,
                url
              }
            },
            survey{
              id
            }
          }
        }
      }`,
      {
        variables: {
          where: id
        }
      }, token, status);
    return data.maps[0];
  } catch (e) {
    return e.message
  }
}





export async function getPublicMap(id, token = null, status = null) {
  try {
    const data = await fetchAPIGraphQl(`
    query {
      maps(where: {id:${id}}) {
        title,
        surveys {
          id,
          forms,
          mmdcustomers{
            id,
            geometry,
            properties,
            is_approved,
            icon{
              id,
              icon{
                id,
                url
              }
            },
          },
          mmdpublicusers{
            id,
            properties,
            geometry,
            is_approved,
            public_user{
              publicAddress
            },
            icon{
              id,
              icon{
                id,
                url
              }
            },
          },
        },
        mapsurveyconfs{
          default_popup_style_slug,
          selected_survey_properties,
          edited_survey_properties,
          icons{
            id,
            icon{
              id,
              url
            }
          },
          survey{
            id
          }
        }
      }
   
      }

 `,
      {
        variables: {

        }
      }, token, status);
    return data.maps[0];
  } catch (e) {
    return e.message
  }
}


export async function getMapGeneralData(id, mapId, token = null, status = null) {
  try {
    const data = await fetchAPIGraphQl(`
  query {
        maps(where: {id:${id},mapId:"${mapId}"}) {
          title,
          type,
          loginTitle,
          welcomeMessage,
          loginLogo{
            url
          },
          dialog_title,
          auth_types,
          auth_attributes,
          description,
          id,
         logo{
           url
         },
          mapstyle{
            id,
            link
          },
          updated_at,
          mapId,
          subtitle,
          zoomLevel,
          center,
          link,
          tags{
            id,
            name
          },

          surveys {
            id,
            forms,
            mmdcustomers{
              id,
              geometry,
              properties,
              is_approved,
              icon{
                id,
                icon{
                  id,
                  url
                }
              },
            },
            mmdpublicusers{
              id,
              properties,
              geometry,
              is_approved,
              public_user{
                publicAddress
              },
             
              icon{
                id,
                icon{
                  id,
                  url
                }
              },
            },
          },
          datasets {
            title,
            id,
            datasetcontents{
              type,
              properties,
              geometry
            }
          },
          mapdatasetconfs{
            default_popup_style_slug,
            selected_dataset_properties,
            edited_dataset_properties,
            icon{
              id,
              icon{
                id,
                url
              }
            },
            dataset{
              id
            }
          },
          mapsurveyconfs{
            default_popup_style_slug,
            selected_survey_properties,
            edited_survey_properties,
            icons{
              id,
              icon{
                id,
                url
              }
            },
            survey{
              id
            }
          }
        }
        mapstyles(where:{type:"default"}) {
          id,
          link,
          type
        }
        tags {
          id,
          name,
        }
        injectedcodes(where:{map:${id}}) {
          id,
          title,
          body,
          isEndOfBody
        }
        icons(sort: "updated_at:desc") {
          id,
          icon{
            url,
            name
          },
          name,
        }
      }`,
      {
        variables: {

        }
      }, token, status);
    return data;
  } catch (e) {
    return e.message
  }
}




export async function getMMDPublicUser(mapId, token = null, status = null) {
  try {
    const data = await fetchAPIGraphQl(`
  query Posts($where: JSON)
      {
        mmdpublicusers(where: $where) {
          id,
          geometry,
          properties,
          public_user{
            id
          },
          is_approved,
          icon{
            id,
            icon{
              id,
              url
            }
          },
        }
      }`,
      {
        variables: {
          where: mapId
        }
      }, token, status);
    return data.mmdpublicusers;
  } catch (e) {
    return { error: e.message }
  }
}
export async function getMMDCustomersClients(condition, token = null, status = null) {
  try {
    const data = await fetchAPIGraphQl(`
  query Posts($where: JSON)
      {
        mmdcustomers(where: $where) {
          
          id,
          geometry,
          properties,
          is_approved,
          icon{
            id,
            icon{
              id,
              url
            }
          },
        }
      }`,
      {
        variables: {
          where: condition
        }
      }, token, status);
    return data.mmdcustomers;
  } catch (e) {
    return { error: e.message }
  }
}
export async function getDatasetsByMap(mapId, token = null, needToken = true) {
  try {
    const data = await fetchAPIGraphQl(`
  query Posts($where: JSON)
      {
        datasets(where: $where) {
          title,
          id,
          datasetcontents{
            type,
            properties,
            geometry
          }
        
        }
      }`,
      {
        variables: {
          where: mapId
        }
      }, token, needToken);
    return data.datasets;
  } catch (e) {
    return { error: e.message }
  }
}
export async function getSurveysAndDatasetByMap(id, token) {
  try {
    const data = await fetchAPIGraphQl(`
  query
      {
        surveys(where:{maps:${id}}) {
          id,
          forms
        }
        datasets(where:{maps:${id}}) {
          title,
          id,
          datasetcontents{
            type,
            properties,
            geometry
          }
        }
      }`,
      {
        variables: {

        }
      }, token);
    return data;
  } catch (e) {
    return { error: e.message }
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
          size,
          maps{
            title,
            type
          },
          datasetcontents{
            type,
            properties,
            geometry
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
          map{
            title
          },
          is_approved,
          updated_at,
          properties,
          id,
          
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
export async function getIcons(token) {
  try {
    const data = await fetchAPIGraphQl(`
  query Posts
      {
        icons(sort: " updated_at:desc") {
          id,
          icon{
            url,
            name
          },
          name,
        }
      }`,
      {
        variables: {

        }
      }, token);
    return data.icons;
  } catch (e) {
    return { error: e.message }
  }
}
export async function getMapDatasetConf(datasetId, token) {
  try {
    const data = await fetchAPIGraphQl(`
  query Posts($where: JSON)
      {
        mapdatasetconfs(where: $where) {
          id,
        }
      }`,
      {
        variables: {
          where: datasetId
        }
      }, token);
    return data.mapdatasetconfs;
  } catch (e) {
    return { error: e.message }
  }
}
export async function getDatasetConfContent(id, token) {
  try {
    const data = await fetchAPIGraphQl(`
  query Posts($where: JSON)
      {
        mapdatasetconfs(where: $where) {
          id,
          selected_dataset_properties,
          edited_dataset_properties,
          listview_properties,
          icon{
            id,
            icon{
              id,
              url
            }
          }
        }
      }`,
      {
        variables: {
          where: id
        }
      }, token);
    return data.mapdatasetconfs;
  } catch (e) {
    return { error: e.message }
  }
}
export async function getDatasetConfSelectedDataset(id, token) {
  try {
    const data = await fetchAPIGraphQl(`
  query Posts($where: JSON)
      {
        mapdatasetconfs(where: $where) {
          id,
          selected_dataset_properties,
          edited_dataset_properties,
        }
      }`,
      {
        variables: {
          where: id
        }
      }, token);
    return data.mapdatasetconfs;
  } catch (e) {
    return { error: e.message }
  }
}
export async function getMapSurveyConf(surveyId, token) {
  try {
    const data = await fetchAPIGraphQl(`
  query Posts($where: JSON)
      {
        mapsurveyconfs(where: $where) {
          id,
        }
      }`,
      {
        variables: {
          where: surveyId
        }
      }, token);
    return data.mapsurveyconfs;
  } catch (e) {
    return { error: e.message }
  }
}
export async function getSurveyConfContent(id, token) {
  try {
    const data = await fetchAPIGraphQl(`
  query Posts($where: JSON)
      {
        mapsurveyconfs(where: $where) {
          id,
          selected_survey_properties,
          edited_survey_properties,
          icons{
            id,
            icon{
              id,
              url
            }
          }
        }
      }`,
      {
        variables: {
          where: id
        }
      }, token);
    return data.mapsurveyconfs;
  } catch (e) {
    return { error: e.message }
  }
}

export async function getMapStyles(condition, token) {
  try {
    const data = await fetchAPIGraphQl(`
  query Posts($where: JSON)
      {
        mapstyles(where: $where) {
          id,
          link,
          type
        }
      }`,
      {
        variables: {
          where: condition
        }
      }, token);
    return data.mapstyles;
  } catch (e) {
    return { error: e.message }
  }
}
export async function getCreateMapData(id, token) {
  try {
    const data = await fetchAPIGraphQl(`
  query
      {
        mapstyles(where:{type:"default"}) {
          id,
          link,
          type
        }
        tags {
          id,
          name,
        }
        injectedcodes(where:{map:${id}}) {
          id,
          title,
          body,
          isEndOfBody
        }
        icons(sort: " updated_at:desc") {
          id,
          icon{
            url,
            name
          },
          name,
        }

      }`,
      {
        variables: {

        }
      }, token);
    return data;
  } catch (e) {
    return { error: e.message }
  }
}
export async function getClientMapData(id, mapId, token = null, status = null) {
  try {
    const data = await fetchAPIGraphQl(`
  query
      { 
        maps(where:{id:${id},mapId:"${mapId}"}) {
          title,
          type,
          description,
          auth_attributes,
          id,
         logo{
           url
         },
         map_attributes{
           id,
           attribute,
         },
          mapstyle{
            id,
            link
          },
          updated_at,
          mapId,
          subtitle,
          zoomLevel,
          center,
          link,
          tags{
            id,
            name
          },
          mapsurveyconfs{
            default_popup_style_slug,
            selected_survey_properties,
            edited_survey_properties,
            icons{
              id,
              icon{
                id,
                url
              }
            },
            survey{
              id
            }
          },
          surveys {
            id,
            forms,
            mmdcustomers{
              id,
              geometry,
              properties,
              is_approved,
              icon{
                id,
                icon{
                  id,
                  url
                }
              },
            },
            mmdpublicusers{
              id,
              properties,
              geometry,
              is_approved,
              public_user{
                publicAddress
              },
             
              icon{
                id,
                icon{
                  id,
                  url
                }
              },
            },
          },
          datasets {
            title,
            id,
            datasetcontents{
              type,
              properties,
              geometry
            }
          },
          mapdatasetconfs{
            default_popup_style_slug,
            selected_dataset_properties,
            edited_dataset_properties,
            icon{
              id,
              icon{
                id,
                url
              }
            },
            dataset{
              id
            }
          }
        }
        injectedcodes(where:{map:${id}}) {
          id,
          title,
          body,
          isEndOfBody
        }
      }`,
      {
        variables: {

        }
      }, token, status);
    return data;
  } catch (e) {
    return e.message
  }
}
export async function getInjectedCodes(condition, token, needToken = true) {
  try {
    const data = await fetchAPIGraphQl(`
  query Posts($where: JSON)
      {
        injectedcodes(where: $where) {
          id,
          title,
          body
        }
      }`,
      {
        variables: {
          where: condition
        }
      }, token, needToken);
    return data.injectedcodes;
  } catch (e) {
    return { error: e.message }
  }
}
export async function getSurveyForms(mapId, token, needToken) {
  try {
    const data = await fetchAPIGraphQl(`
  query Posts($where: JSON)
      {
        surveys(where: $where) {
          forms,
          id,
          updated_at,
          maps{
            title,
            type
          }
        }
      }`,
      {
        variables: {
          where: mapId
        }
      }, token, needToken);
    return data.surveys;
  } catch (e) {
    return { error: e.message }
  }
}
export async function getSurveyFormsValues(surveyId, token) {
  try {
    const data = await fetchAPIGraphQl(`
    query
    {
      mmdcustomers(where:{ survey:${surveyId}}) {
        properties        
      }
      mmdpublicusers(where:{survey:${surveyId}}){
        properties
      }
    }`,
      {
        variables: {

        }
      }, token);
    return data;
  } catch (e) {
    return { error: e.message }
  }
}
export async function checkPublicUsersMapBased(condition, token = null, status = null) {
  try {
    const data = await fetchAPIGraphQl(`
  query Posts($where: JSON)
      {
        publicUsers(where: $where) {
          id
        }
      }`,
      {
        variables: {
          where: condition
        }
      }, token, status);
    return data;
  } catch (e) {
    return { error: e.message }
  }
}
export async function getPublicUsers(condition, token = null, status = null) {
  try {
    const data = await fetchAPIGraphQl(`
  query Posts($where: JSON)
      {
        publicUsers(where: $where) {
          id,
          maps{
            id,
            visits,
            title,
            user{
              id
            }
          }
        }
      }`,
      {
        variables: {
          where: condition
        }
      }, token, status);
    return data.publicUsers;
  } catch (e) {
    return { error: e.message }
  }
}
export async function getMapAnalyticsDataByDate(date, token) {
  try {
    const data = await fetchAPIGraphQl(`
  query
      {
        publicUsers(where:{ created_at_gt:"${date}"}) {
          id,
          created_at,
          maps{
            id,
            visits,
            title,
            user{
              id
            }
          }
         
        }
      }`,
      {
        variables: {

        }
      }, token);
    return data.publicUsers;
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
export async function putPublicUserFileMethod(url, data) {
  const res = await fetch(`${strapiUrl}/${url}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
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
export async function putMethodPublicUser(url, data) {
  const res = await fetch(`${strapiUrl}/${url}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
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
export async function postMethodPublicUser(url, data) {
  const res = await fetch(`${strapiUrl}/${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
export function getStrapiURL(path) {
  return `${process.env.NEXT_PUBLIC_STRAPI_API_URL}${path}`;
}
