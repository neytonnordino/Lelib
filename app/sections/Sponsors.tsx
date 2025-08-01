"use client";

import React from "react";
import { motion } from "framer-motion";

const Sponsors = () => {
  return (
    <section className=" bg-gray-50">
      <div>
        <h3 className="text-center text-xl md:text-3xl title">Proudly sponsored</h3>
        <div className="flex gap-28 overflow-x-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-10">
          <motion.div
            className="flex gap-28 pr-28"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 40,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {/* Duplicar elementos para efeito contínuo */}
            {[...Array(2)].map((_, dupIndex) => (
              <div key={dupIndex} className="flex gap-28 flex-none">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i + dupIndex * 10}
                    className="text-xl md:text-3xl hover:text-amber-500 transition-colors text-neutral-900/50 font-bold uppercase"
                  >
                    Sponsors
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
