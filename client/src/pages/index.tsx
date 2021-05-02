import React, { useCallback } from "react";
import { graphql, PageProps } from "gatsby";
import styled from "styled-components";
import isFuture from "date-fns/isFuture";

import Layout from "../components/layout";
import Seo from "../components/seo";
import PostPreview from "../components/post-preview";
import { DeepRequired } from "../helpers/deep-required";
import getBlogPostPath from "../helpers/get-blog-post-path";
import { IMAGE_MAX_WIDTH_PX } from "../theme";

const PostPreviews = styled.ul`
  max-width: ${IMAGE_MAX_WIDTH_PX}px;
  width: 100%;
  margin: 0 auto;
`;

const PostPreviewsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-left: -0.5rem;
  margin-right: -0.5rem;
`;

export const query = graphql`
  query IndexPage {
    allSiteSettings: allSanitySiteSettings {
      edges {
        node {
          title
          description
          keywords
        }
      }
    }
    posts: allSanityPost(
      limit: 6
      sort: { fields: [publishedAt], order: DESC }
      filter: { slug: { current: { ne: null } }, publishedAt: { ne: null } }
    ) {
      edges {
        node {
          id
          title
          subtitle
          publishedAt
          mainImage {
            asset {
              fluid(maxWidth: 1192) {
                aspectRatio
                src
                srcSet
                srcWebp
                srcSetWebp
                sizes
              }
            }
            # alt
          }
          # _rawExcerpt
          slug {
            current
          }
        }
      }
    }
  }
`;

type PostNode = DeepRequired<
  GatsbyTypes.IndexPageQuery["posts"]["edges"][0]["node"],
  ["id"] | ["title"] | ["slug"] | ["subtitle"] | ["mainImage"] | ["publishedAt"]
>;

type SiteSettingsNode = DeepRequired<
  GatsbyTypes.IndexPageQuery["allSiteSettings"]["edges"][0]["node"],
  ["title"] | ["description"] | ["keywords"]
>;
type IndexPageProps = PageProps<
  {
    allSiteSettings: { edges: { node: SiteSettingsNode }[] };
  } & {
    posts: { edges: { node: PostNode }[] };
  },
  GatsbyTypes.SitePageContext
>;

const IndexPage: React.FC<IndexPageProps> = props => {
  let { allSiteSettings, posts } = props.data;
  let { edges: postEdges = [] } = posts;
  const [siteSettingsEdge] = allSiteSettings.edges;

  if (!siteSettingsEdge) {
    console.error(
      'Missing "Site settings". Open the CMS and add some content to "Site settings".'
    );
  }

  const siteMeta = siteSettingsEdge ? siteSettingsEdge.node : {};

  const rows = postEdges
    .filter(edge => !isFuture(new Date(edge.node.publishedAt)))
    .reduce(
      (groups, edge) => {
        if (groups.length === 0) {
          return [[edge]];
        }
        const currentGroup = groups[groups.length - 1];

        if (groups.length === 1) {
          return [currentGroup, [edge]];
        }
        if (groups.length === 2 && currentGroup.length === 2) {
          return [...groups, [edge]];
        }

        // group.length >= 3
        if (currentGroup.length === 3) {
          return [...groups, [edge]];
        }

        return [...groups.slice(0, groups.length - 1), [...currentGroup, edge]];
      },
      [] as {
        node: PostNode;
      }[][]
    );
console.log(rows);
  const postPreviewProps = useCallback(
    (node: PostNode) => ({
      key: `index__PostPreview__post:${node.id}`,
      title: node.title,
      subtitle: node.subtitle,
      image: node.mainImage,
      publishedAt: node.publishedAt,
      path: getBlogPostPath(node),
    }),
    []
  );

  return (
    <Layout>
      <Seo
      // title={site.title}
      // description={site.description}
      // keywords={site.keywords}
      />
      {/* <Container> */}
      <h1 hidden>Welcome to {siteMeta.title}</h1>
      <PostPreviews>
        {rows.map((row, rowNumber) => {
          if (row.length === 1) {
            const [{ node }] = row;

            if (rows.length === 1) {
              // This is the only post on the blog, so should be full size
              return (
                <PostPreviewsRow key={`index__PostPreview__post:${rowNumber}`}>
                  <PostPreview {...postPreviewProps(node)} variant="full" />
                </PostPreviewsRow>
              );
            }

            return (
              <PostPreviewsRow key={`index__PostPreview__post:${rowNumber}`}>
                <PostPreview {...postPreviewProps(node)} variant="whole" />
              </PostPreviewsRow>
            );
          }

          if (row.length === 2) {
            return (
              <PostPreviewsRow key={`index__PostPreview__post:${rowNumber}`}>
                {row.map(({ node }) => (
                  <PostPreview {...postPreviewProps(node)} variant="half" />
                ))}
              </PostPreviewsRow>
            );
          }
          if (row.length === 3) {
            return (
              <PostPreviewsRow key={`index__PostPreview__post:${rowNumber}`}>
                {row.map(({ node }) => (
                  <PostPreview {...postPreviewProps(node)} variant="third" />
                ))}
              </PostPreviewsRow>
            );
          }
        })}
      </PostPreviews>

      {/* </Container> */}
    </Layout>
  );
};

export default IndexPage;
