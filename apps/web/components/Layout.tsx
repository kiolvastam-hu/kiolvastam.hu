import Nav from 'components/nav/Nav'
import Head from 'next/head'
import React from 'react'
import { Wrapper, WrapperVariant } from './Wrapper'

interface LayoutProps {
  variant?: WrapperVariant
  title?: string
}

export const Layout: React.FC<LayoutProps> = ({ children, variant, title }) => {
  return (
    <>
      <Head>
        <title>{title ? `${title} - `:''}Kiolvastam.hu</title>
        <meta name="description" content="kiolvastam.hu" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Nav />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  )
}
