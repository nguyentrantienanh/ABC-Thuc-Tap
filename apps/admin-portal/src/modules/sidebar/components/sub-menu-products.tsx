import { FC } from 'react';
import classNames from 'classnames';
import { NavLink, useLocation, useSearchParams } from 'react-router-dom';
import { useLocale, useTranslations } from 'use-intl';
import { objectToQueryString } from '@repo/shared-universal/utils/string.util';

type SubMenuProductsProps = {
  type: 'dropdown' | 'list';
  onNavigate?: () => void;
};

const SubMenuProducts: FC<SubMenuProductsProps> = ({ type, onNavigate }) => {
  const t = useTranslations();
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const locale = useLocale();

  const handleClick = () => {
    onNavigate?.();
  };

  const className = type === 'list' ? 'px-10' : '';

  return (
    <div>
      <NavLink
        to={{
          pathname: `/${locale}/products/new`,
          search: `?${objectToQueryString({
            sidebar: searchParams.get('sidebar'),
            type: searchParams.get('type'),
          })}`,
        }}
        className={classNames(
          'flex items-center rounded p-2 transition-colors',
          type === 'dropdown' && 'hover:bg-accent',
          type === 'dropdown' && pathname.includes(`/${locale}/products/new`) && '!bg-primary !text-white',
          type === 'list' && pathname.includes(`/${locale}/products/new`) && '!text-primary'
        )}
        onClick={handleClick}
      >
        <p className={classNames('whitespace-nowrap', className)}>{t('sidebar_menu_products_create_new')}</p>
      </NavLink>
    </div>
  );
};

export default SubMenuProducts;
