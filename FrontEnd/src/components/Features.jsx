import { motion } from 'framer-motion'
import { BookOpen, BookmarkCheck, Globe, BarChart2, PenTool } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Diversity of media',
    description: 'Dive into a world of eBooks and audiobooks, all at your fingertips.',
  },
  {
    icon: BookmarkCheck,
    title: 'Track Your Journey',
    description: 'Keep tabs on your reading progress and never lose your place with convenient bookmarking.',
  },
  {
    icon: Globe,
    title: 'Seamless Multi-Language Support',
    description: 'Enjoy your books in a variety of languages, including English, Hindi, and Marathi.',
  },
  {
    icon: BarChart2,
    title: 'Data-Driven Insights',
    description: 'Gain valuable insights with detailed feedback tracking to enhance your reading experience.',
  },
  {
    icon: PenTool,
    title: 'Become a Creator',
    description: 'Join our community as an author and share your books with the world!',
  },
];

export default function Features() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Why Choose{' '}
            <span className="text-blue-500">
              BookAura
            </span>
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover the benefits of digital reading with our feature-packed platform
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all p-6 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="text-blue-500 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

