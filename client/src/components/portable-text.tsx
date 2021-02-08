import React from "react";
import sanityConfig from "../../sanity-config";
import BasePortableText from "@sanity/block-content-to-react";
import Figure from "./figure";
import { Link } from "gatsby";
import getBlogPostPath from "../helpers/get-blog-post-path";
import Youtube from "./youtube";
import Twitter from "./twitter";

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
      console.log("INTERNAL LINK", mark, children);

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
  },
};

interface PortableTextProps {
  blocks: GatsbyTypes.SanityBlock[];
}
const PortableText: React.FC<PortableTextProps> = props => {
  const { blocks } = props;
  return (
    <BasePortableText
      blocks={blocks}
      serializers={serializers}
      {...sanityConfig}
    />
  );
};

export default PortableText;
