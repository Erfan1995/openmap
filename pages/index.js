import { getMethod, getOneMap } from "lib/api";
import { extractMapData } from "lib/general-functions";

import dynamic from "next/dynamic";
export default function Home({ mapData, manualMapData, datasets }) {
  const Dashboard = dynamic(() => import("../components/dashboard"), {
    ssr: false
  });
  return (
    <Dashboard mapData={mapData} manualMapData={manualMapData} datasets={datasets} />
  );
}



export async function getServerSideProps(ctx) {

  try {
    const { mapToken, id } = ctx.query;
    if (id) {
      const res = await getMethod(`maps?mapId=${decodeURI(mapToken)}&id=${id}`, null, false);
       // const res = await getOneMap({mapId:decodeURI(mapToken),id:id},null,false);
      if (!(res.length > 0)) {
        return {
          redirect: {
            destination: '/server-error',
            permanent: false,
          }
        }
      } else {
        const datasetData = await getMethod(`datasets?_where[0][maps.id]=${id}`, null, false);
        return {
          props: { mapData: res[0], manualMapData: await extractMapData(res[0]), datasets: datasetData },
        };
      }
    } else {
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
