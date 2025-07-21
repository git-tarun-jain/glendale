import { GraphQLClient, gql } from 'graphql-request';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL ?? '';

interface nodeItem {
  altText: string;
  sourceUrl: string;
}

interface HomeImage {
  node: nodeItem;
}

interface HomeWhyBox {
  boxTitle: string;
  boxDescription: string;
  boxImage?: HomeImage;
}

interface HomeWhyData {
  wsSubtitle?: string;
  wsTitle?: string;
  wsBoxes?: HomeWhyBox[];
}

export interface GetHomeWhyResponse {
  pageBy: {
    homepageSettings: HomeWhyData;
  };
}

export async function getHomeWhyData(): Promise<GetHomeWhyResponse | null> {
  const query = gql`
    query GetHomeWhy {
      pageBy(pageId: 2) {
        homepageSettings {
          wsSubtitle
          wsTitle
          wsBoxes {
            boxTitle
            boxDescription
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
    const data = await client.request<GetHomeWhyResponse>(query);
    return data;
  } catch (error) {
    console.error('Error fetching home why data settings:', error);
    return null;
  }
}

interface HomeWhyProps {
  hwdata?: HomeWhyData;
}

export default function HomeWhy({ hwdata }: HomeWhyProps) {
  if (!hwdata) return null;

  const { wsSubtitle, wsTitle, wsBoxes } = hwdata;

  return (
    <section className="sections">
      <div className="container">
        <div className="sections_title" data-aos="fade" data-aos-delay="300">
          {wsSubtitle && <span className="subtitle">{wsSubtitle}</span>}
          {wsTitle && <h2>{wsTitle}</h2>}
        </div>
        <div className="row tb_space gx-xxl-5 justify-content-center">
          {wsBoxes?.map((item, index) => (
            <div className="col-lg-4" key={index}>
              <div className="icon_box">
                {item?.boxImage?.node?.sourceUrl && (
                  <div className="icon_img">
                    <Image
                      src={item.boxImage.node.sourceUrl}
                      alt={item.boxImage.node.altText || ''}
                      width={50}
                      height={50}
                      unoptimized
                    />
                  </div>
                )}
                {item?.boxTitle && <h3>{item.boxTitle}</h3>}
                {item?.boxDescription && (
                  <div dangerouslySetInnerHTML={{ __html: item.boxDescription }} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
