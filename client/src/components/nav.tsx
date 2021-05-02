// Using this guide for accessibility:
// https://a11y-style-guide.com/style-guide/section-navigation.html#kssref-navigation-navigation-mobile

import { graphql, Link, useStaticQuery } from "gatsby";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { colours } from "../theme";

import { BREAK_POINT_M_PX } from "./global-style";
import NavButton from "./nav-button";

const DURATION_MS = 300;

const NavRoot = styled.nav<{ isHidden: boolean }>`
  position: fixed;
  right: 0;
  top: 0;
  left: ${props => (props.isHidden ? "unset" : "0")};
  bottom: ${props => (props.isHidden ? "unset" : "0")};
  z-index: 1000;
  pointer-events: auto;

  a {
    color: #fff;
    text-decoration: none;
  }

  @media (min-width: ${BREAK_POINT_M_PX}px) {
    position: absolute;
    right: 1rem;
    top: 1rem;
    left: auto;
    bottom: unset;
  }
`;

const NavOuterWrapper = styled.div<{ isHidden: boolean }>`
  position: absolute;
  right: 0;
  bottom: 0;
  left: ${props => (props.isHidden ? "unset" : "0")};
  top: 0;

  visibility: ${props => (props.isHidden ? "hidden" : "inherit")};

  @media (min-width: ${BREAK_POINT_M_PX}px) {
    width: 370px;
    bottom: unset;
    left: unset;
    top: unset;
  }
`;
const NavInnerWrapper = styled.div<{ isOpen: boolean }>`
  width: 100%;
  height: 100%;
  padding: 1rem;
  background-color: ${colours.black};
  color: #fff;
  opacity: ${props => (props.isOpen ? 1 : 0)};
  transition: opacity ${DURATION_MS}ms ease-in-out,
    transform ${DURATION_MS}ms ease-in-out;
  box-shadow: 0 20px 70px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  will-change: opacity, transform;

  @media (min-width: ${BREAK_POINT_M_PX}px) {
    transform: translateY(${props => (props.isOpen ? 0 : "0.4rem")});
    padding: 0.7rem 1rem;
  }
`;
const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  margin-bottom: 1rem;

  &:last-of-type {
    margin-bottom: 0.4rem;
  }
`;

const Nav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  // isHidden is set to true instantly when opening the Nav
  // and set to false after the timer finishes.
  // This is to allow the transition to take place.
  const [isHidden, setIsHidden] = useState(true);

  const { allMenu } = useStaticQuery<GatsbyTypes.MenuQuery>(graphql`
    query Menu {
      allMenu: allSanityMenu {
        edges {
          node {
            pages {
              _id
              slug {
                current
              }
              title
            }
          }
        }
      }
    }
  `);
  console.log(allMenu);
  const [menu] = allMenu.edges;

  if (!menu) {
    throw new Error("No menu");
  }

  useEffect(() => {
    if (isOpen) {
      return setIsHidden(false);
    }

    const timerId = setTimeout(() => setIsHidden(true), DURATION_MS);

    return () => clearTimeout(timerId);
  }, [isOpen, setIsOpen]);

  return (
    <NavRoot isHidden={isHidden}>
      <NavButton
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        ariaControls="Nav-content"
      />
      <NavOuterWrapper
        id="Nav-content"
        aria-hidden={!isOpen}
        isHidden={isHidden}
      >
        <NavInnerWrapper isOpen={isOpen}>
          <NavLink to="/">Decolonising Geography</NavLink>
          {menu.node.pages.map(({ _id, slug, title }) => (
            <NavLink key={_id} to={`/${slug.current}`}>
              {title}
            </NavLink>
          ))}
          <NavLink to="/about">About</NavLink>
          <NavLink to="/events">Events</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </NavInnerWrapper>
      </NavOuterWrapper>
    </NavRoot>
  );
};

export default Nav;
