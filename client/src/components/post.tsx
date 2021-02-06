import { Link } from "gatsby";
import React from "react";
import styled from "styled-components";
import { PostTemplateData } from "../templates/post";

import formatDate from "../helpers/format-date";
import getBlogPostPath from "../helpers/get-blog-post-path";
import PortableText from "./portable-text";
import TwitterIcon from "./twitter-icon";
import { H1, Subtitle } from "./typography";
import PostArticle from "./post-article";
import PostContent from "./post-content";
import PostHeader from "./post-header";
import PostImage from "./post-image";
import { MAX_IMAGE_WIDTH_PX } from "../helpers/constants";
import PostMainImage from "./post-main-image";

const ByLineAndSocial = styled.div`
  display: flex;
  justify-content: space-between;
  color: rgba(0, 0, 0, 0.54);
`;
const AuthorLink = styled(Link)`
  color: rgb(0, 140, 255);
`;
const PublishedAt = styled.span`
  color: rgba(0, 0, 0, 0.84);
`;

const SocialLink = styled.a``;

interface PostProps extends PostTemplateData {}

const Post: React.FC<PostProps> = props => {
  const {
    title,
    subtitle,
    authors,
    _rawBody,
    mainImage,
    publishedAt,
    slug,
  } = props.post;

  return (
    <PostArticle>
      <PostHeader>
        <H1>{title}</H1>
        <Subtitle as="p">{subtitle}</Subtitle>
        <ByLineAndSocial>
          <span>
            Written by{" "}
            <AuthorLink rel="author" to="/about">
              {authors[0]?.name}
            </AuthorLink>{" "}
            on <PublishedAt>{formatDate(publishedAt)}</PublishedAt>
          </span>
          <SocialLink
            // TODO: add author data to the tweet text
            href={`https://twitter.com/share?url=${getBlogPostPath({
              publishedAt,
              slug,
            })}&text=${title}:`}
            target="_blank"
          >
            <TwitterIcon width={"1.5rem"} height={"1.5rem"} />
          </SocialLink>
        </ByLineAndSocial>
      </PostHeader>
      {mainImage && (
        <PostMainImage>
          <PostImage
            {...{
              ...mainImage,
              asset: {
                ...mainImage.asset,
                fluid: { ...mainImage.asset.fluid, aspectRatio: 16 / 9 },
              },
            }}
          />
        </PostMainImage>
      )}
      <PostContent>
        <PortableText blocks={_rawBody} />
      </PostContent>
    </PostArticle>
  );
};

export default Post;