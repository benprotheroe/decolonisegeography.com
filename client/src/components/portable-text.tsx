import React, { Fragment } from "react";
import sanityConfig from "../../sanity-config";
import BasePortableText from "@sanity/block-content-to-react";
import Figure from "./figure";
import { Link } from "gatsby";
import getBlogPostPath from "../helpers/get-blog-post-path";
import Youtube from "./youtube";
import Twitter from "./twitter";
import GoogleDriveVideo from "./google-drive-video";

const serializers = {
  marks: {
    link: ({ mark, children }) => {
      const { blank, href } = mark;
      return blank ? (
        <a href={href} target="_blank" rel="noopener">
          {children}
        </a>
      ) : (
        <a href={href}>{children}</a>
      );
    },
    internalLink: ({ mark, children }) => {
      if (!mark.reference || mark.reference._type !== "post") {
        console.error("Unsupported internal link");
        return children;
      }
      const path = getBlogPostPath(mark.reference);

      return <Link to={path}>{children}</Link>;
    },
  },
  types: {
    authorReference: ({ node }) => <span>{node.author.name}</span>,
    mainImage: Figure,
    youtube: ({ node }) => <Youtube url={node.url} />,
    twitter: ({ node }) => <Twitter id={node.id} />,
    googleDriveVideo: ({ node }) => <GoogleDriveVideo id={node.id} />,
  },
};

export interface PortableTextProps {
  blocks: GatsbyTypes.SanityBlock[];
}
const PortableText: React.FC<PortableTextProps> = props => {
  const { blocks } = props;
  return (
    <Fragment>
      <BasePortableText
        blocks={blocks}
        serializers={serializers}
        {...sanityConfig}
      />
    </Fragment>
  );
};

export default PortableText;
