import { GraphQLClient, gql } from 'graphql-request';
import Image from 'next/image';

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL ?? '';

interface nodeItem {
  sourceUrl: string;
  altText: string;
}

interface HomeImage {
  node: nodeItem;
}

interface HomeBillboardData {
  bsImage?: HomeImage;
}

export interface GetHomeBillboardResponse {
  pageBy: {
    homepageSettings: HomeBillboardData;
  };
}

export async function getHomeBillboardData(): Promise<GetHomeBillboardResponse | null> {
  const query = gql`
    query GetHomeBillboard {
      pageBy(pageId: 2) {
        homepageSettings {
          bsImage {
            node {
              altText
              sourceUrl
            }
          }
        }
      }
    }
  `;

  try {
    const client = new GraphQLClient(API_URL);
    const data = await client.request<GetHomeBillboardResponse>(query);
    return data;
  } catch (error) {
    console.error('Error fetching home billboard data settings:', error);
    return null;
  }
}

interface HomeBillboardProps {
  hbdata?: HomeBillboardData;
}

export default function homeBillboard({ hbdata }: HomeBillboardProps) {
    if (!hbdata) return null;

  const {
    bsImage
  } = hbdata;

  return (
    <>
    {bsImage &&
    <div className="billboard header_gap">
      <div className="item">
          <Image src={bsImage?.node?.sourceUrl} alt={bsImage?.node?.altText} fill />
      </div>
    </div>
    }
    </>
  );
}


