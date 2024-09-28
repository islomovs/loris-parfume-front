'use client';
import { BranchCard } from '@/app/components/BranchCard';
import YandexMap from '@/app/components/BYandexMap';
import { IBranchItem } from '@/services/branches';
import { Spinner } from '@chakra-ui/react';
import { Col, Row } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

const BranchesPage = ({
  branches,
  error: isError,
  isLoading,
}: {
  branches: IBranchItem[];
  error: any;
  isLoading: boolean;
}) => {
  const { t } = useTranslation('common');

  return (
    <div className='flex flex-col py-5 px-4 md:px-8'>
      <h1 className='uppercase font-normal text-center md:my-[50px] text-xl tracking-[.2em] text-[#454545] mb-8'>
        {t('branches')}
      </h1>
      <Row gutter={[16, 16]}>
        {isLoading ? (
          <div className='flex justify-center items-center w-full py-10'>
            <Spinner size='lg' color='#87754f' /> {/* Chakra UI Spinner */}
          </div>
        ) : isError ? (
          <p className='text-center text-red-500'>Error loading branches</p>
        ) : (
          branches?.map((branch: IBranchItem) => (
            <Col xs={24} sm={12} md={8} lg={8} key={branch.id}>
              <BranchCard
                title={branch.name}
                address={branch.name}
                phone={branch.phone}
                location={branch.redirectTo}
              />
            </Col>
          ))
        )}
      </Row>
      <div className='mt-8 md:mt-14'>
        {branches ? (
          <YandexMap branches={branches} />
        ) : (
          <div className='flex justify-center items-center'>
            <Spinner size='lg' color='#87754f' />{' '}
            {/* Chakra UI Spinner for the map */}
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchesPage;
