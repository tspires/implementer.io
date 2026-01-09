const signups = new Map();

module.exports = {
  async query(sql, params = []) {
    const sqlLower = sql.toLowerCase();

    if (sqlLower.includes('insert into signups')) {
      const email = params[0];
      if (!signups.has(email)) {
        signups.set(email, {
          id: signups.size + 1,
          email: params[0],
          ip_address: params[1],
          user_agent: params[2],
          source: 'website',
          created_at: new Date().toISOString()
        });
      }
      return { rows: [], rowCount: 1 };
    }

    if (sqlLower.includes('select') && sqlLower.includes('signups')) {
      return { rows: Array.from(signups.values()), rowCount: signups.size };
    }

    return { rows: [], rowCount: 0 };
  },

  _reset() {
    signups.clear();
  },

  _getSignups() {
    return Array.from(signups.values());
  }
};
