import React from "react";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Event from "../components/event";
import { DeepRequired } from "../helpers/deep-required";
import useSiteSettings from "../hooks/useSiteSettings";

export const query = graphql`
  query EventTemplate($id: String!) {
    event: sanityEvent(id: { eq: $id }) {
      title
      subtitle
      publishedAt
      _rawLink(resolveReferences: { maxDepth: 5 })
      location{
      lat
      lng
      alt
      _key
      _type
    }
      # description
      slug {
        current
      }
      eventOrganiser{
      _id
      name
    }
      _rawBody(resolveReferences: { maxDepth: 5 })
      authors {
        _key
        # image {
        #   asset {
        #     fixed(width: 40, height: 40) {
        #       ...GatsbySanityImageFixed
        #     }
        #   }
        # }
        name
        twitterHandle
        websiteUrl
      }
    }
  }
`;

export type EventTemplateData = DeepRequired<
  GatsbyTypes.EventTemplateQuery,
  | ["event", "title"]
  | ["event", "_rawBody"]
  | ["event", "_rawLink"]
  | ["event", "Location"]
  | ["event", "subtitle"]
  | ["event", "slug"]
  | ["event", "authors", "name"]
  | ["event", "publishedAt"]
  | ["event", "eventOrganiser"]
>;

interface EventTemplateProps {
  data: EventTemplateData;
}
const EventTemplate: React.FC<EventTemplateProps> = ({ data }) => {
  const siteSettings = useSiteSettings();

  if (!data || !data.event) {
    return null;
  }

  return (
    <Layout>
      <Event event={data.event} siteSettings={siteSettings} />
    </Layout>
  );
};

export default EventTemplate;
