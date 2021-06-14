import { getMethod } from "lib/api";

import dynamic from "next/dynamic";
export default function Home({mapDetails}) {
  const Dashboard = dynamic(() => import("../components/dashboard"), {
    ssr: false
  });
  return (
    <Dashboard  mapDetails={mapDetails} />
  );
}



export async function getServerSideProps(ctx) {

  try {
    const { mapToken,id } = ctx.query;
    const res = await getMethod(`maps?mapId=${decodeURI(mapToken)}&id=${id}`,null,false);
    if(!(res.length > 0)){
      return {
        redirect: {
          destination: '/server-error',
          permanent: false,
        }
      }
    }

    return {
      props: {mapDetails:res[0]},
    };
  } catch (e) {
    console.log(e);
    return {
      redirect: {
        destination: '/server-error',
        permanent: false,
      }
    }
  }

}
