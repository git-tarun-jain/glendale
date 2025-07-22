import { GraphQLClient, gql } from 'graphql-request';
import Image from 'next/image';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL ?? '';

interface HeaderButton {
  title: string;
  url: string;
  target?: string;
}

interface HeaderImage {
  altText?: string;
  sourceUrl?: string;
}

interface HeaderImageNode {
  node: HeaderImage;
}

interface HeaderData {
  headerButton1?: HeaderButton;
  headerButton2?: HeaderButton;
  headerEmail?: string;
  headerLogo?: HeaderImageNode;
  headerPhone?: string;
}

interface MenuItem {
  label: string;
  uri: string;
}

interface HeaderMenuNode {
  menuItems: {
    nodes: MenuItem[];
  };
}

export interface GetHeaderResponse {
  headerSettings: {
    themeHeaderSettings: HeaderData;
  };
}

export interface GetHeaderMenuResponse {
  menus: {
    nodes: HeaderMenuNode[];
  };
}

interface HeaderProps {
  hdata?: HeaderData;
  hmdata?: HeaderMenuNode;
}

export async function getHeaderData(): Promise<GetHeaderResponse | null> {
  const query = gql`
    query GetHeader {      
      headerSettings {
        themeHeaderSettings {
          headerButton1 {
            target
            title
            url
          }
          headerButton2 {
            target
            title
            url
          }
          headerEmail
          headerLogo {
            node {
              altText
              sourceUrl
            }
          }
          headerPhone
        }
      }
    }
  `;

  try {
    const client = new GraphQLClient(API_URL);
    const data = await client.request<GetHeaderResponse>(query);
    return data;
  } catch (error) {
    console.error('Error fetching header data settings:', error);
    return null;
  }
}

export async function getHeaderMenuData(): Promise<GetHeaderMenuResponse | null> {
  const query = gql`
    query GetMenu {
      menus(where: { location: PRIMARY }) {
        nodes {
          menuItems {
            nodes {
              label
              uri
            }
          }
        }
      }
    }
  `;

  try {
    const client = new GraphQLClient(API_URL);
    const data = await client.request<GetHeaderMenuResponse>(query);
    return data;
  } catch (error) {
    console.error('Error fetching header menu data:', error);
    return null;
  }
}


export default function Header({ hdata, hmdata }: HeaderProps) {
  if (!hdata) return null;

  const {
    headerButton1,
    headerButton2,
    headerEmail,
    headerLogo,
    headerPhone
  } = hdata;

  return (
    <>
      <header className="header">
          <div className="container-fluid">
              <div className="logo">
                {headerLogo && 
                  <Link href="/">
                      <Image src={headerLogo?.node?.sourceUrl || ''} alt={headerLogo?.node?.altText || ''} title={headerLogo?.node?.altText || ''} width={500} height={200} />
                  </Link>
                }
              </div>
              <div className="main_header">
                  <div className="top_header">
                    {headerPhone && (
                        <Link className="my_btn sm lightBtn" href={`tel:${headerPhone}`}>
                          <i className="fa-solid fa-phone"></i>
                        </Link>
                    )}
                    {headerEmail && (
                        <Link className="my_btn sm lightBtn" href={`mailto:${headerEmail}`}>
                          <i className="fa-solid fa-envelope"></i>
                        </Link>
                    )}
                    {headerButton1 && (
                      <Link href={headerButton1.url} className="my_btn sm lightBtn">{headerButton1.title}</Link>
                    )}
                    {headerButton2 && (
                      <Link href={headerButton2.url} className="my_btn sm">{headerButton2.title}</Link>
                    )}
                  </div>
                  <div className="mainmenu">
                      <ul className="slimmenu">
                        {hmdata?.menuItems?.nodes?.map((item, index) => (
                          <li key={index}>
                            <Link href={item.uri}>{item.label}</Link>
                          </li>
                        ))}
                      </ul>
                  </div>
              </div>
          </div>
      </header>
      <div className="clearfix"></div>
    </>
  );
}
