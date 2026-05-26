'use client'

import { useState, useEffect } from 'react'

interface TypingEffectProps {
  words: string[]
  typingSpeed?: number
  deletingSpeed?: number
  delayBetweenWords?: number
}

export default function TypingEffect({
  words,
  typingSpeed = 100,
  deletingSpeed = 50,
  delayBetweenWords = 2000
}: TypingEffectProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentWord = words[currentWordIndex]

      if (isDeleting) {
        setCurrentText(currentWord.substring(0, currentText.length - 1))
        if (currentText.length === 0) {
          setIsDeleting(false)
          setCurrentWordIndex((prev) => (prev + 1) % words.length)
        }
      } else {
        setCurrentText(currentWord.substring(0, currentText.length + 1))
        if (currentText === currentWord) {
          setTimeout(() => setIsDeleting(true), delayBetweenWords)
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed)

    return () => clearTimeout(timer)
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, delayBetweenWords])

  return (
    <span style={{ borderRight: '3px solid var(--accent)', paddingRight: '4px' }}>
      {currentText}
    </span>
  )
}
