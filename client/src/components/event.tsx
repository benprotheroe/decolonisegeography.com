import React, { Fragment } from "react";
import styled from "styled-components";

import { EventTemplateData } from "../templates/event";
import formatDate from "../helpers/format-date";
import getEventPath from "../helpers/get-event-path";
import PortableText from "./portable-text";
import TwitterIcon from "./twitter-icon";
import { H1, Subtitle } from "./typography";
import PostArticle from "./post-article";
import PostContent from "./post-content";
import PostHeader from "./post-header";
import PostImage from "./post-image";
import PostMainImage from "./post-main-image";
import { SiteSettings } from "../hooks/useSiteSettings";
import Seo from "./seo";

const ByLineAndSocial = styled.div`
  display: flex;
  justify-content: space-between;
  color: rgba(0, 0, 0, 0.54);
`;
const AuthorLink = styled.a`
  color: rgb(0, 140, 255);
`;
const PublishedAt = styled.span`
  color: rgba(0, 0, 0, 0.84);
`;

const SocialLink = styled.a``;

interface EventProps extends EventTemplateData {
  siteSettings: SiteSettings;
}

const Event: React.FC<EventProps> = props => {
  const { event, siteSettings } = props;
  console.log(event)

  const { siteUrl } = siteSettings;

  let {
    title,
    subtitle,
    authors = [],
    _rawBody,
    mainImage,
    publishedAt,
    slug,
  } = event;

  return (
    <PostArticle>
      <Seo
        title={title}
        description={subtitle}
        image={mainImage.asset?.fluid?.src}
        author={authors[0]}
      />
      <PostHeader>
        <H1>{title}</H1>
        <Subtitle as="p">{subtitle}</Subtitle>
        <ByLineAndSocial>
          <span>
            Written by{" "}
            {authors.map((author, i) => {
              if (!author) {
                return null;
              }

              const getPunctuation = (index: number, total: number) => {
                const isLast = i === authors.length - 1;
                const isPenultimate = i === authors.length - 2;
                if (isLast) {
                  return " ";
                }
                if (total === 2) {
                  return " and ";
                }
                if (isPenultimate) {
                  return ", and ";
                }
                return ", ";
              };

              const authorHref = author.twitterHandle
                ? `https://twitter.com/${author.twitterHandle}`
                : author.websiteUrl
                ? author.websiteUrl
                : "#";

              return (
                <Fragment>
                  <AuthorLink
                    rel="author"
                    target={authorHref === "#" ? undefined : "_blank"}
                    href={authorHref}
                  >
                    {author.name}
                  </AuthorLink>
                  {getPunctuation(i, authors.length)}
                </Fragment>
              );
            })}
            on <PublishedAt>{formatDate(publishedAt)}</PublishedAt>
          </span>
          <SocialLink
            // TODO: add author data to the tweet text
            href={`https://twitter.com/share?url=${siteUrl}${getEventPath({
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

export default Event;
