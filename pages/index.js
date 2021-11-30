import { getMethod } from "lib/api";
import { extractMapDataPublic } from "lib/general-functions";


import dynamic from "next/dynamic";
export default function Home({ mapData = null, manualMapData = null, datasets = null, mapToken = null, type, survey = null }) {
  const Dashboard = dynamic(() => import("../components/dashboard"), {
    ssr: false
  });
  const SharedSurvey = dynamic(() => import("../components/shared-survey"), {
    ssr: false
  })
  return (
    <div>{type === '0' ?
      <Dashboard mapData={mapData} manualMapData={manualMapData} datasets={datasets} mapToken={mapToken} />
      :
      <SharedSurvey survey={survey} />
    }
    </div>
  );
}



export async function getServerSideProps(ctx) {
  try {
    console.log(typeof (ctx.query.t));
    console.log(ctx.query.survey);
    if (ctx.query.t === '1') {
      console.log('heloooooooooooooooooooooooooooooooo')
      const { type, surveyId } = ctx.query;
      const res = await getMethod(`surveys?id=${ctx.query.survey}`, null, false);
      console.log(res, 'ressssssssssssssssssss');
      if (!res.length > 0) {
        return {
          redirect: {
            destination: '/errors/404',
            permanent: false,
          }
        }
      } else {
        return {
          props: { type: type, survey: res[0] }
        }
      }
    } else if (ctx.query.t === '0') {
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
              datasets: datasetData, mapToken: mapToken, type: type
            },
          };
        }
      }
    }
    else {
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
