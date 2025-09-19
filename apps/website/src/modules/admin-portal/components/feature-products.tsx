import React, { FC } from 'react';
import classNames from 'classnames';

import { ComponentBaseProps } from '@/interfaces/component.interface';

import SwiperSlider from '@/components/swiper-slider';

import ProductsAddNew from '@/assets/images/products-add-new.png';
import ProductsEdit from '@/assets/images/products-edit.png';
import ProductsList from '@/assets/images/products-list.png';

const images = [
  {
    image: ProductsList,
  },
  {
    image: ProductsAddNew,
  },
  {
    image: ProductsEdit,
  },
];

const FeatureProducts: FC<ComponentBaseProps> = ({ className }) => {
  return (
    <div className={classNames('grid gap-4', className)}>
      <div className="grid gap-4">
        <h2 className="text-2xl font-bold">Products</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Omnis hic sint nobis cupiditate assumenda incidunt voluptatibus. Quasi quisquam
          assumenda saepe alias enim architecto corporis ipsam ex quos delectus esse modi, explicabo fugit ullam non provident illo mollitia.
        </p>
        <SwiperSlider items={images} groupName="products" />
      </div>
    </div>
  );
};

export default FeatureProducts;
