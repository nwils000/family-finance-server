// A plain "Privacy" link for screens kids see (kid sign-in, kid home), so the policy is always
// one tap away, as COPPA expects wherever a child's information is collected.
import { Link } from 'react-router-dom';
import { LEGAL_PATHS } from '@kk/shared';

export function PrivacyLink() {
  return (
    <Link to={LEGAL_PATHS.privacy} className="self-center text-sm font-bold text-ink-soft underline underline-offset-4 hover:text-ink">
      Privacy
    </Link>
  );
}
