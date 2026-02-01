'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ArrowLeft, Mail, Lock } from 'lucide-react';

export default function AdminGatePage() {
  return (
    <div className="min-h-screen w-full bg-[#09090B] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Decor (Subtle Grid) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#09090B] via-transparent to-[#09090B]"></div>

      <div className="relative z-10 max-w-md w-full">
        
        {/* Main Card */}
        <div className="bg-[#18181B] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Header Strip */}
          <div className="h-2 w-full bg-gradient-to-r from-red-500 via-orange-500 to-red-500"></div>

          <div className="p-8 text-center">
            
            {/* Icon Animation */}
            <div className="mx-auto mb-6 w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
              <Lock className="w-8 h-8 text-red-500" />
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
              Access Restricted
            </h1>
            
            <div className="inline-block px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-xs font-medium mb-6">
              Sarkari Job Updates • Admin Portal
            </div>

            {/* Main Message */}
            <p className="text-zinc-400 text-sm leading-relaxed mb-8">
              You do not have permission to view this page. This area is strictly monitored and limited to authorized personnel only.
            </p>

            {/* Divider */}
            <div className="w-full h-px bg-zinc-800 mb-8"></div>

            {/* Contact / Collaboration Section */}
            <div className="bg-zinc-900/50 rounded-lg p-4 border border-dashed border-zinc-800 mb-8">
              <h3 className="text-zinc-200 text-sm font-semibold mb-1">
                Want to work with us?
              </h3>
              <p className="text-xs text-zinc-500 mb-3">
                We are always looking for contributors.
              </p>
              <Button 
                variant="outline" 
                className="w-full border-zinc-700 bg-transparent text-zinc-300 hover:text-white hover:bg-zinc-800 h-9 text-xs"
              >
                <Mail className="w-3 h-3 mr-2" />
                Contact the Team
              </Button>
            </div>

            {/* Return Action */}
            <Link href="/login">
              <Button className="w-full bg-white text-black hover:bg-zinc-200 font-medium">
                <ArrowLeft className="w-4 h-4 mr-2" />
                 Login
              </Button>
            </Link>

          </div>
          
          {/* Footer Strip */}
          <div className="bg-zinc-900 px-8 py-3 border-t border-zinc-800 flex justify-between items-center">
            <span className="text-[10px] text-zinc-600 font-mono">ERR_403_FORBIDDEN</span>
            <span className="text-[10px] text-zinc-600 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Secure System
            </span>
          </div>

        </div>
      </div>
    </div>
  )
}