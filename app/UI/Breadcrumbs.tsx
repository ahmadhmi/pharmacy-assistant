import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 

const Breadcrumbs = () => {
  const pathname = usePathname();
  const pathSegments = pathname.split('/').filter((path) => path !== '');

  const breadcrumbLinks = pathSegments.map((segment, index) => {

    const href = '/' + pathSegments.slice(0, index + 1).join('/');

    const segmentName = segment.replace(/-/g, ' ').toUpperCase();

    return (
      <span key={href}>
        <Link href={href}>
          {segmentName}
        </Link>
        {index < pathSegments.length - 1 ? ' > ' : ''}
      </span>
    );
  });

  return (
    <nav>
      {breadcrumbLinks.length > 0 ? ' > ' : ''}
      {breadcrumbLinks}
    </nav>
  );
};

export default Breadcrumbs;
