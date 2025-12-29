'use client';

import { useNavigation } from '@/hooks/useNavigation';
import { ThemeToggle } from './ThemeToggle';
import Link from 'next/link';

export default function NavigationHeader() {
  const { currentSection, setCurrentSection } = useNavigation();

  const sections = [
    { id: 'pulse', label: 'Pulse' },
    { id: 'discover', label: 'Discover' },
    { id: 'trackers', label: 'Trackers' },
  ] as const;

  return (
    <div className="border-b border-primaryStroke overflow-hidden flex flex-row w-full h-auto sm:h-[64px] min-h-[auto] sm:min-h-[64px] px-[16px] sm:px-[16px] lg:px-[24px] gap-[16px] sm:gap-[16px] lg:gap-[24px] justify-between sm:justify-start items-center bg-gray-900 dark:bg-gray-900 py-4 sm:py-0">
      {/* Logo */}
      <div className="flex flex-row flex-shrink-0 gap-[0px] justify-start items-center w-[36px] sm:w-[24px] 2xl:w-[130px]">
        <div className="flex flex-row items-center cursor-pointer" onClick={() => setCurrentSection('pulse')}>
          <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[36px] h-[36px] sm:w-[36px] sm:h-[36px] text-textPrimary">
            <g clipPath="url(#clip0_88_28967)">
              <path d="M24.1384 17.3876H11.8623L18.0001 7.00012L24.1384 17.3876Z" fill="currentColor"></path>
              <path d="M31 29.0003L5 29.0003L9.96764 20.5933L26.0324 20.5933L31 29.0003Z" fill="currentColor"></path>
            </g>
            <defs>
              <clipPath id="clip0_88_28967">
                <rect width="26" height="22" fill="white" transform="translate(5 7)"></rect>
              </clipPath>
            </defs>
          </svg>
          <span className="text-lg font-bold text-textPrimary hidden 2xl:inline ml-2">AXIOM</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="hidden sm:flex flex-1 min-w-[0px]">
        <div className="flex overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="flex flex-row gap-[4px] justify-start items-center">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(section.id)}
                className={`flex flex-row h-[32px] text-nowrap px-[8px] xl:px-[14px] justify-start items-center rounded-[4px] text-sm font-medium transition-all duration-135 ${
                  currentSection === section.id
                    ? 'bg-primaryBlue/20 text-primaryBlue'
                    : 'text-textPrimary hover:bg-primaryBlue/20 hover:text-primaryBlue'
                }`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="flex sm:hidden flex-1 min-w-[0px] gap-2">
        {sections.map(section => (
          <button
            key={section.id}
            onClick={() => setCurrentSection(section.id)}
            className={`text-xs font-semibold px-2 py-1 rounded transition-all ${
              currentSection === section.id
                ? 'bg-primaryBlue text-white'
                : 'bg-gray-800 text-textSecondary'
            }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Theme Toggle */}
      <div className="flex flex-row gap-[8px] justify-end items-center">
        <ThemeToggle />
      </div>
    </div>
  );
}
