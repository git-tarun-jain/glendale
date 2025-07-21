import { GraphQLClient, gql } from 'graphql-request';
import Image from 'next/image';
import Link from 'next/link';
import Slider from "react-slick";

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL ?? '';

interface HomeFundingBox {
  boxTitle: string;
  boxImage?: HomeImage;
}
interface homeButton {
  title: string;
  url: string;
  target?: string;
}

interface nodeItem {
  altText: string;
  sourceUrl: string;
}

interface HomeImage {
  node: nodeItem;
}

interface HomeFundingData {
  isSubtitle?: string;
  isTitle?: string;
  isDescription?: string;
  isButton?: homeButton;
  isBoxes?: HomeFundingBox[];
}

export interface GetHomeFundingResponse {
  pageBy: {
    homepageSettings: HomeFundingData;
  };
}

export async function getHomeFundingData(): Promise<GetHomeFundingResponse | null> {
  const query = gql`
    query getHomeFunding {
      pageBy(pageId: 2) {
          homepageSettings {
              isSubtitle
              isTitle
              isDescription
              isButton {
                  target
                  title
                  url
              }
              isBoxes {
                  boxTitle
                  boxImage {
                      node {
                          altText
                          sourceUrl
                      }
                  }
              }
          }
      }
    }
  `;
  
    try {
      const client = new GraphQLClient(API_URL);
      const data = await client.request<GetHomeFundingResponse>(query);
      return data;
    } catch (error) {
      console.error('Error fetching home funding data settings:', error);
      return null;
    }

}

    interface HomeFundingProps {
      hfdata?: HomeFundingData;
    }

export default function homeFunding({ hfdata }: HomeFundingProps) {
    if (!hfdata) return null;

  const {
    isSubtitle,
    isTitle,
    isDescription,
    isButton,
    isBoxes
  } = hfdata;

    const settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: true,
        dots: false,
        autoplay: false,
        autoplaySpeed: 4000,
        swipe: true,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 5,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 992,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 400,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 0,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

  return (
    <section className="sections secondary_bg white">
      <div className="container">
        <div className="sections_title" data-aos="fade" data-aos-delay="100">
          {isSubtitle && <span className="subtitle">{isSubtitle}</span>}
          {isTitle && <h2>{isTitle}</h2>}
          {isDescription && (
            <div dangerouslySetInnerHTML={{ __html: isDescription }} />
          )}
        </div>

        <div className="white_arrow">
            <Slider {...settings}>
                {isBoxes?.map((item, index) => (
                <div className="slick-item" key={index}>
                    <div className="indus_box">
                        {item?.boxImage?.node?.sourceUrl && (
                            <div className="indus_img">
                              <Image src={item.boxImage.node.sourceUrl} alt={item.boxImage.node.altText || ''} width={24} height={16} />
                            </div>
                        )}
                        {item?.boxTitle && <span>{item.boxTitle}</span>}
                    </div>
                </div>
                ))}
            </Slider>
        </div>

        {isButton && (
          <div className="btn_holder">
            <Link
              href={isButton.url}
              className="my_btn"
              target={isButton.target}
              rel="noopener noreferrer"
            >
              {isButton.title}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
