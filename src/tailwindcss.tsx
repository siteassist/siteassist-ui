import type {PropsWithChildren} from 'react';

import styles from './tailwind.css?inline';

export default function TailwindCSS({children}: PropsWithChildren) {
  return (
    <>
      <style>{styles}</style>
      {children}
    </>
  );
}
