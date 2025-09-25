'use client';

import { Monster } from "../types/game";
import Image from "next/image";

interface MonsterCardProps {
  monster: Monster;
  showActions?: boolean;
  onSelectForBattle?: () => void;
}

export function MonsterCard({ monster, showActions, onSelectForBattle }: MonsterCardProps) {
  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      <div className="relative p-6 bg-gray-900 rounded-lg leading-none flex flex-col">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            {monster.name}
          </h3>
          <div className="flex items-center space-x-1">
            <span className="text-yellow-500">★</span>
            <span className="text-sm text-gray-400">Level {Math.floor(monster.xp / 100) + 1}</span>
          </div>
        </div>
        
        <div className="relative w-full h-48 my-4">
          <Image
            src={monster.image}
            alt={monster.name}
            fill
            className="object-contain rounded-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="text-sm text-gray-400">Power</div>
            <div className="text-2xl font-bold text-red-500">{monster.power}</div>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <div className="text-sm text-gray-400">Health</div>
            <div className="text-2xl font-bold text-green-500">{monster.health}</div>
          </div>
        </div>

        {showActions && onSelectForBattle && (
          <button
            onClick={onSelectForBattle}
            className="mt-6 w-full py-3 px-6 text-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-colors"
          >
            Select for Battle
          </button>
        )}
      </div>
    </div>
  );
}