import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Package, Tag, FileText } from 'lucide-react';
import { useApi } from '../../hooks/useApi';