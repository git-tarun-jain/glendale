import { GraphQLClient, gql } from 'graphql-request';
import Image from 'next/image';
import Link from 'next/link';
import Slider from "react-slick";

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL ?? '';

export interface GetFooterResponse {
  footerSettings: {
    themeFooterSettings: FooterData;
  };
}

export interface GetSocialResponse {
  socialMediaSettings: {
    themeSocialMediaSettings: SocialData;
  };
}

export async function getFooterData(): Promise<GetFooterResponse | null> {
    const query = gql`
        query GetFooter {
          footerSettings {
            themeFooterSettings {
              footerAddress
              footerAddressLink
              footerCopyright
              footerEmailContentBoxes {
                boxContent
              }
              footerGallery {
                nodes {
                  altText
                  sourceUrl
                }
              }
              footerLogos {
                flLink
                flLogo {
                  node {
                    altText
                    sourceUrl
                  }
                }
              }
              footerLogosTitle
              footerPhone
            }
          }
        }
    `;

    try {
      const client = new GraphQLClient(API_URL);
      const data = await client.request<GetFooterResponse>(query); 
      
      return data;
    } catch (error) {
      console.error('Error fetching footer data settings:', error);
      return null;
    }
}

export async function getSocialData(): Promise<GetSocialResponse | null> {
    const query = gql`
      query GetSocial {
        socialMediaSettings {
          themeSocialMediaSettings {
            facebookUrl
            instagramUrl
            linkedinUrl
            pinterestUrl
          }
        }
      }
    `;

    
    try {
      const client = new GraphQLClient(API_URL);
      const data = await client.request<GetSocialResponse>(query); 
      return data;
    } catch (error) {
      console.error('Error fetching social data settings:', error);
      return null;
    }
}

interface FooterImage {
  altText?: string;
  sourceUrl?: string;
}

interface FooterContentBox {
  boxContent?: string;
}

interface FooterLogoNode {
  node: FooterImage;
}

interface FooterLogoBox {
  flLink?: string;
  flLogo?: FooterLogoNode;
}

interface FooterImageBox {
  nodes?: FooterImage[];
}

export interface FooterData {
    footerAddress?: string;
    footerAddressLink?: string;
    footerCopyright?: string;
    footerEmailContentBoxes?: FooterContentBox[];
    footerGallery?: FooterImageBox;
    footerLogos?: FooterLogoBox[];
    footerLogosTitle?: string;
    footerPhone?: string;
}

interface SocialData {
    facebookUrl?: string;
    instagramUrl?: string;
    linkedinUrl?: string;
    pinterestUrl?: string;
}

interface FooterProps {
  fdata?: FooterData;
  sdata?: SocialData;
}

export default function Footer({ fdata, sdata }: FooterProps) {
  if (!fdata) return null;
    
    const {
        footerAddress,
        footerAddressLink,
        footerCopyright,
        footerEmailContentBoxes,
        footerGallery,
        footerLogos,
        footerLogosTitle,
        footerPhone
    } = fdata;
    
    const {
        facebookUrl,
        instagramUrl,
        linkedinUrl,
        pinterestUrl
    } = sdata || {};

    const settings = {
        infinite: false,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        dots: false,
        autoplay: true,
        autoplaySpeed: 5000,
        responsive: [
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 4,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 0,
                settings: {
                    slidesToShow: 2,
                },
            },
        ],
    };
   
  return (
    <>
      <div className="gallery image_popups">
        <div className="white_arrow">
          <Slider {...settings}>
            {footerGallery?.nodes?.map((item, index) => (
              <div className="slick-item" key={index}>                    
                {item?.sourceUrl && (
                  <Link href={item?.sourceUrl} className="fit_img">
                    <Image src={item?.sourceUrl || ''} alt={item?.altText || ''} fill />
                  </Link>
                )}                    
              </div>
            ))}
          </Slider>
        </div>
      </div>
      <footer className="footer">
        <Image className="fern_shape" src="/images/fern-shape.svg" alt="Shape" width={24} height={16} />
        <Image className="fern_shape tr" src="/images/fern-shape.svg" alt="Shape" width={24} height={16} />
        <div className="container">
          <div className="row justify-content-between">
              <div className="col-lg-9 ct_footer">
                  <h3>The Glendale Lyceum</h3>
                  <div className="row tb_space">
                      <div className="col-md-6">
                        {footerAddress && footerAddressLink &&
                          <div>
                            <Link href={footerAddressLink} target="_blank">
                              <i className="fa-solid fa-location-dot"></i>
                              <div dangerouslySetInnerHTML={{ __html: footerAddress }} />
                            </Link>
                          </div>
                        }
                        {footerPhone &&
                            <p><Link href={`tel:${footerPhone}`}><i className="fa-solid fa-phone"></i> {footerPhone}</Link></p>
                        }
                      </div>
                      {footerEmailContentBoxes?.map((item, index) => (
                        <div className="col-md-6" key={index}>                    
                          <div dangerouslySetInnerHTML={{ __html: item.boxContent || '' }} />                 
                        </div>
                      ))}                        
                  </div>
              </div>
              <div className="col-lg-3 reviewOn">
                  {footerLogosTitle && <h3>{footerLogosTitle}</h3>}
                  {footerLogos &&
                    <ul>
                        {footerLogos?.map((item, index) => (
                          <li key={index}>
                            <Link href={item.flLink || '#'} className="review_logo" target="_blank">
                              <Image src={item?.flLogo?.node?.sourceUrl || ''} alt={item?.flLogo?.node?.altText || 'Logo'} width={100} height={100} />
                            </Link>
                          </li>
                        ))}                        
                    </ul>
                  }
                </div>
          </div>
          <div className="copyright">
            {footerCopyright &&
              <div dangerouslySetInnerHTML={{ __html: footerCopyright}} />
            }
            <ul className="social_media">
              {facebookUrl &&
                <li><a href={facebookUrl} target="_blank"><i className="fa-brands fa-facebook-f"></i></a></li>
              }
              {instagramUrl &&
                <li><a href={instagramUrl} target="_blank"><i className="fa-brands fa-instagram"></i></a></li>
              }
              {pinterestUrl &&
                <li><a href={pinterestUrl} target="_blank"><i className="fa-brands fa-pinterest-p"></i></a></li>
              }
              {linkedinUrl &&
                <li><a href={linkedinUrl} target="_blank"><i className="fa-brands fa-linkedin-in"></i></a></li>
              }
            </ul>
          </div>
        </div>
      </footer>
      <div className="go-up"><i className="fa-solid fa-angle-up"></i></div>
    </>
  );
}


