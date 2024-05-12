import Head from "next/head"

const Headtitle = props => {
  const { title } = props
  return (<>
    <Head>
      <title>{title}</title>
    </Head>
  </>)

}
export default Headtitle
