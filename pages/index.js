import { getMethod } from "lib/api";
import { extractMapDataPublic } from "lib/general-functions";


import dynamic from "next/dynamic";
export default function Home({ mapData, manualMapData, datasets ,mapToken}) {
  const Dashboard = dynamic(() => import("../components/dashboard"), {
    ssr: false
  });
  return (
    <Dashboard mapData={mapData} manualMapData={manualMapData} datasets={datasets} mapToken={mapToken} />
  );
}



export async function getServerSideProps(ctx) {

  try {
    const { mapToken, id } = ctx.query;
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
          props: { mapData: res[0], manualMapData: await extractMapDataPublic(res[0]), datasets: datasetData,mapToken:mapToken },
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
