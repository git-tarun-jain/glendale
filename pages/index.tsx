import Header, {
  getHeaderData,
  getHeaderMenuData,
  GetHeaderResponse,
  GetHeaderMenuResponse,
} from '../components/header';

import Footer, {
  getFooterData,
  getSocialData,
  GetFooterResponse,
  GetSocialResponse,
} from '../components/footer';

import HomeBillboard, {
  getHomeBillboardData,
  GetHomeBillboardResponse,
} from '../components/homeBillboard';

import ContactForm from '../components/contactForm'; 

export async function getStaticProps() {
  const headerData = await getHeaderData();
  const headerMenuData = await getHeaderMenuData();
  const footerData = await getFooterData();
  const socialData = await getSocialData();
  const homeBillboardData = await getHomeBillboardData();

  return {
    props: {
      headerData,
      headerMenuData,
      footerData,
      socialData,
      homeBillboardData
    },
    revalidate: 60, 
  };
}

interface HomeProps {
  headerData: GetHeaderResponse;
  headerMenuData: GetHeaderMenuResponse;
  footerData: GetFooterResponse;
  socialData: GetSocialResponse;
  homeBillboardData: GetHomeBillboardResponse;
}

export default function Home({ headerData, headerMenuData, footerData, socialData, homeBillboardData }: HomeProps) {
  
  return (
    <>
      <Header 
        hdata={headerData?.headerSettings?.themeHeaderSettings} 
        hmdata={headerMenuData?.menus?.nodes?.[0]} 
      />
      <main className="main_wrapper">
        <HomeBillboard 
          hbdata={homeBillboardData?.pageBy?.homepageSettings} 
        />
        <ContactForm />
      </main>
      <Footer 
        fdata={footerData?.footerSettings?.themeFooterSettings} 
        sdata={socialData?.socialMediaSettings?.themeSocialMediaSettings} 
      />
    </>
  );
}
