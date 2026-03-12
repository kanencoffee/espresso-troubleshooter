export default function DifficultyBadge({ difficulty }) {
  const config = {
    beginner: {
      label: 'Beginner',
      classes: 'bg-green-100 text-green-800 border border-green-200',
    },
    intermediate: {
      label: 'Intermediate',
      classes: 'bg-amber-100 text-amber-800 border border-amber-200',
    },
    advanced: {
      label: 'Advanced',
      classes: 'bg-red-100 text-red-800 border border-red-200',
    },
  };

  const { label, classes } = config[difficulty] || config.beginner;

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${classes}`}>
      {label}
    </span>
  );
}
