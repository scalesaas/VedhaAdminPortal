"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useUser } from "@/lib/store/user";
import Profile from "./profile";
import Logout from "@/components/logout";
import { Button } from "@/components/ui/button";
import { usePathname } from 'next/navigation';
import logo from "../../public/logoashish.png";
import Image from "next/image";
import { Menu, X, ChevronDown, LayoutDashboard } from "lucide-react";
import { Playfair_Display, Lora } from 'next/font/google';
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Setup Fonts
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const user = useUser((state) => state.user);

  useEffect(() => {
    setIsLoggedIn(!!user?.id);
  }, [user]);

  // Scroll Logic for Auto-Hide
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  // Mobile Menu Click Outside
  useEffect(() => {
    const handleClickOutside = () => setIsMobileMenuOpen(false);
    if (isMobileMenuOpen) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div 
      className={cn(
        "fixed w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]",
        playfair.variable, 
        lora.variable,
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <nav 
        className={cn(
          "relative border-b transition-colors duration-300",
          // Scroll Logic: Dark background with Blur when scrolling
          lastScrollY > 10 
            ? "bg-[#09090B]/90 border-zinc-800 backdrop-blur-md" 
            : "bg-[#09090B] border-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 md:h-24">
            
            {/* Logo Section */}
            <div className="flex items-center shrink-0">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="relative overflow-hidden">
                  Admin portal
                  {/* <Image
                    src={logo}
                    alt="Little Dreamers"
                    height={120}
                    width={120}
                    // Added 'invert' to make black logo white. Remove if logo is already white.
                    className="h-12 w-auto object-contain md:h-14 opacity-90 transition-opacity group-hover:opacity-100 invert" 
                  /> */}
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {['Courses', 'Blogs'].map((item) => (
                <Link 
                  key={item}
                  href={`/${item.toLowerCase()}`} 
                  className="relative group py-2"
                >
                  <span className={`font-lora text-lg transition-colors ${
                    pathname === `/${item.toLowerCase()}` 
                      ? 'text-white font-medium' 
                      : 'text-zinc-400 group-hover:text-zinc-100'
                  }`}>
                    {item}
                  </span>
                  {/* Underline Effect (White for Dark Mode) */}
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ease-out" />
                </Link>
              ))}
            </div>

            {/* Desktop User Actions */}
            <div className="hidden md:flex items-center gap-4">
              {user?.id ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full bg-white/20 hover:bg-white/10 transition-colors focus:outline-none border border-transparent hover:border-zinc-700">
                      {/* <span className="font-lora text-sm font-medium text-zinc-300 ml-2">Account</span> */}
                      {/* <div className="h-10 w-10 rounded-full overflow-hidden border border-zinc-700">
                        <Profile />
                      </div> */}
                      {user.email}
                      <ChevronDown className="w-4 h-4 text-zinc-500 mr-2" />
                    </button>
                  </DropdownMenuTrigger>
                  
                  {/* Dark Mode Dropdown */}
                  <DropdownMenuContent className="w-56 mt-2 bg-[#18181B] border-zinc-800 text-zinc-100 shadow-2xl rounded-xl font-lora" align="end">
                    <DropdownMenuLabel className="font-playfair text-lg font-normal text-white">
                      My Account
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-zinc-800" />
                    <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer focus:text-white">
                      <Link href="/dashboard" className="w-full flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-zinc-800 cursor-pointer focus:text-white">
                      <Link href="/profile" className="w-full">
                         Profile Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-zinc-800" />
                    <DropdownMenuItem className="focus:bg-red-900/20 cursor-pointer">
                      <Link href="/login" className="w-full text-red-400 font-medium flex items-center gap-2">
                        <Logout /> 
                        {/* <span className="text-sm">Sign Out</span> */}
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button 
                    variant="ghost" 
                    className="rounded-full bg-white text-black font-lora px-6 py-5 text-base hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-sm"
                  >
                    Start Reading
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={toggleMobileMenu}
                className="h-10 w-10 p-0 hover:bg-transparent text-white"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6 stroke-[1.5]" /> : <Menu className="h-6 w-6 stroke-[1.5]" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Panel (Dark Mode) */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] bg-[#09090B] border-b border-zinc-800 ${
            isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-6 space-y-4 font-lora">
            <Link 
              href="/courses" 
              className="block text-2xl text-zinc-100 py-2 border-b border-zinc-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Courses
            </Link>
            <Link 
              href="/blogs" 
              className="block text-2xl text-zinc-100 py-2 border-b border-zinc-800"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blogs
            </Link>
            
            <div className="pt-6 pb-4">
              {!user?.id ? (
                 <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                   <Button className="w-full rounded-full bg-white text-black font-lora py-6 text-lg hover:bg-zinc-200">
                     Login / Register
                   </Button>
                 </Link>
              ) : (
                <div className="flex flex-col gap-4">
                   <Link href="/dashboard" className="text-lg text-zinc-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                     Dashboard
                   </Link>
                   <Link href="/profile" className="text-lg text-zinc-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
                     My Profile
                   </Link>
                   <div className="text-red-500">
                      <Logout />
                   </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}