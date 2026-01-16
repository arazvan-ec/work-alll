import { describe, it, expect } from 'vitest'
import {
  mockClubs,
  mockPlayers,
  mockCoaches,
  getClubWithStats,
  getFreePlayers,
  getFreeCoaches,
  getContractedPlayers,
  getContractedCoaches,
} from './mockData'

describe('mockData', () => {
  describe('mockClubs', () => {
    it('has 3 clubs', () => {
      expect(mockClubs).toHaveLength(3)
    })

    it('each club has required fields', () => {
      mockClubs.forEach(club => {
        expect(club).toHaveProperty('id')
        expect(club).toHaveProperty('name')
        expect(club).toHaveProperty('budget')
        expect(typeof club.id).toBe('number')
        expect(typeof club.name).toBe('string')
        expect(typeof club.budget).toBe('number')
      })
    })
  })

  describe('mockPlayers', () => {
    it('has 15 players', () => {
      expect(mockPlayers).toHaveLength(15)
    })

    it('each player has required fields', () => {
      mockPlayers.forEach(player => {
        expect(player).toHaveProperty('id')
        expect(player).toHaveProperty('name')
        expect(typeof player.id).toBe('number')
        expect(typeof player.name).toBe('string')
      })
    })

    it('some players are free agents', () => {
      const freePlayers = mockPlayers.filter(p => !p.club)
      expect(freePlayers.length).toBeGreaterThan(0)
    })

    it('some players are contracted', () => {
      const contractedPlayers = mockPlayers.filter(p => p.club)
      expect(contractedPlayers.length).toBeGreaterThan(0)
    })
  })

  describe('mockCoaches', () => {
    it('has 5 coaches', () => {
      expect(mockCoaches).toHaveLength(5)
    })

    it('some coaches are free agents', () => {
      const freeCoaches = mockCoaches.filter(c => !c.club)
      expect(freeCoaches.length).toBeGreaterThan(0)
    })
  })
})

describe('getClubWithStats', () => {
  it('calculates totalSalaries correctly', () => {
    const club = mockClubs[0] // FC Barcelona
    const result = getClubWithStats(club, mockPlayers, mockCoaches)

    // Barcelona has Messi (1.5M), Pedri (800K), Gavi (600K), Pep (500K)
    const expectedSalaries = 1500000 + 800000 + 600000 + 500000
    expect(result.totalSalaries).toBe(expectedSalaries)
  })

  it('calculates availableBudget correctly', () => {
    const club = mockClubs[0]
    const result = getClubWithStats(club, mockPlayers, mockCoaches)

    expect(result.availableBudget).toBe(club.budget - result.totalSalaries)
  })

  it('counts players correctly', () => {
    const club = mockClubs[0]
    const result = getClubWithStats(club, mockPlayers, mockCoaches)

    const expectedCount = mockPlayers.filter(p => p.club?.id === club.id).length
    expect(result.playersCount).toBe(expectedCount)
  })

  it('counts coaches correctly', () => {
    const club = mockClubs[0]
    const result = getClubWithStats(club, mockPlayers, mockCoaches)

    const expectedCount = mockCoaches.filter(c => c.club?.id === club.id).length
    expect(result.coachesCount).toBe(expectedCount)
  })

  it('preserves original club data', () => {
    const club = mockClubs[0]
    const result = getClubWithStats(club, mockPlayers, mockCoaches)

    expect(result.id).toBe(club.id)
    expect(result.name).toBe(club.name)
    expect(result.budget).toBe(club.budget)
  })
})

describe('getFreePlayers', () => {
  it('returns only players without a club', () => {
    const freePlayers = getFreePlayers(mockPlayers)

    freePlayers.forEach(player => {
      expect(player.club).toBeUndefined()
    })
  })

  it('returns correct count', () => {
    const freePlayers = getFreePlayers(mockPlayers)
    const expectedCount = mockPlayers.filter(p => !p.club).length

    expect(freePlayers).toHaveLength(expectedCount)
  })
})

describe('getFreeCoaches', () => {
  it('returns only coaches without a club', () => {
    const freeCoaches = getFreeCoaches(mockCoaches)

    freeCoaches.forEach(coach => {
      expect(coach.club).toBeUndefined()
    })
  })
})

describe('getContractedPlayers', () => {
  it('returns only players with a club', () => {
    const contractedPlayers = getContractedPlayers(mockPlayers)

    contractedPlayers.forEach(player => {
      expect(player.club).toBeDefined()
    })
  })
})

describe('getContractedCoaches', () => {
  it('returns only coaches with a club', () => {
    const contractedCoaches = getContractedCoaches(mockCoaches)

    contractedCoaches.forEach(coach => {
      expect(coach.club).toBeDefined()
    })
  })
})
