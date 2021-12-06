import { getMethod } from "lib/api";
import { extractMapDataPublic } from "lib/general-functions";


import dynamic from "next/dynamic";
export default function Home({ mapData = null, manualMapData = null, datasets = null, mapToken = null, type = null, survey = null }) {
  console.log(mapData);
  const Dashboard = dynamic(() => import("../components/dashboard"), {
    ssr: false
  });
  const SharedSurvey = dynamic(() => import("../components/shared-survey"), {
    ssr: false
  })
  return (
    <div>{type === 'map' ?
      <Dashboard mapData={mapData} manualMapData={manualMapData} datasets={datasets} mapToken={mapToken} />
      :
      <SharedSurvey survey={survey} />
    }
    </div>
  );
}



export async function getServerSideProps(ctx) {
  try {
    if (ctx.query.t === '1') {

      const { type, surveyId } = ctx.query;
      const res = await getMethod(`surveys?id=${ctx.query.survey}`, null, false);
      if (!res.length > 0) {
        return {
          redirect: {
            destination: '/errors/404',
            permanent: false,
          }
        }
      } else {
        return {
          props: { type: 'survey', survey: res[0] }
        }
      }
    } else if (ctx.query.t === '0') {
    console.log('public map '+ctx.query);

      const { type, mapToken, id } = ctx.query;
      if (id) {
        const res = await getMethod(`maps?mapId=${decodeURI(mapToken)}&id=${id}`, null, false);
        if (!(res.length > 0)) {
          return {
            redirect: {
              destination: '/errors/404',
              permanent: false,
            }
          }
        } else {
          const datasetData = await getMethod(`datasets?_where[0][maps.id]=${id}`, null, false);
          return {
            props: {
              mapData: res[0], manualMapData: await extractMapDataPublic(res[0]),
              datasets: datasetData, mapToken: mapToken, type: 'map'
            },
          };
        }
      }
    }
    else {
    console.log('public map  else ');

      return {
        redirect: {
          destination: '/customer/maps',
          permanent: false,
        }
      }
    }
  } catch (e) {
    return {
      redirect: {
        destination: '/customer/maps',
        permanent: false,
      }
    }
  }

}
