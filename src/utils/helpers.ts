import { nanoid } from 'nanoid';

import type { CanvasElement, Layer, Project, User } from '@/types';

export const generateId = (): string => nanoid();

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const createNewProject = (name: string, ownerId: string): Project => {
  const now = new Date();

  return {
    id: generateId(),
    name,
    description: '',
    ownerId,
    createdAt: now,
    updatedAt: now,
  };
};

export const createNewLayer = (name: string): Layer => {
  return {
    id: generateId(),
    name,
    visible: true,
    locked: false,
    elements: [],
  };
};

export const createNewElement = (
  type: CanvasElement['type'],
  x: number,
  y: number,
): CanvasElement => {
  return {
    id: generateId(),
    type,
    x,
    y,
    width: 100,
    height: 100,
    properties: {},
  };
};

export const validateUser = (user: Partial<User>): user is User => {
  return (
    typeof user.id === 'string' &&
    typeof user.name === 'string' &&
    typeof user.email === 'string' &&
    user.createdAt instanceof Date
  );
};
