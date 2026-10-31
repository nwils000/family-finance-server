import { IconClose } from '@art';
import { Logo } from './Logo';
import { Navigation } from './Navigation';

/** Server wrapper: renders the art once on the server and hands it to the client nav. */
export function SiteNav() {
  return <Navigation logo={<Logo size={34} />} closeIcon={<IconClose size={22} />} />;
}
