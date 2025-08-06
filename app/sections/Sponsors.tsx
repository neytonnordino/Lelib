"use client";

import React from "react";
import { motion } from "framer-motion";

const Sponsors = () => {
  return (
    <section className=" bg-gray-50 pt-16">
      <div>
        <h3 className="text-center text-xl md:text-3xl title">Proudly sponsored</h3>
        <div className="flex gap-28 overflow-x-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-18">
          <motion.div
            className="flex gap-28 pr-28 group"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 30,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {/* Duplicar elementos para efeito contínuo */}
            {[...Array(2)].map((_, dupIndex) => (
              <div key={dupIndex} className="flex gap-28 flex-none ">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i + dupIndex * 10}
                    className="text-xl md:text-3xl group-hover:text-amber-500 transition-colors text-neutral-900/50 font-bold uppercase cursor-default "
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
