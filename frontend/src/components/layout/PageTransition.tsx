import { motion } from "framer-motion";
import { ReactNode } from "react";

type PageTransitionProps = {
  children: ReactNode;
};

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{
        duration: 0.35,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.main>
  );
}
