package jmc.trazaweb;

// Generated 04-may-2015 1:14:29 by Hibernate Tools 3.4.0.CR1

import java.util.List;
import javax.naming.InitialContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.hibernate.SessionFactory;
import static org.hibernate.criterion.Example.create;

/**
 * Home object for domain model class Kardex.
 * @see jmc.trazaweb.Kardex
 * @author Hibernate Tools
 */
public class KardexHome {

	private static final Log log = LogFactory.getLog(KardexHome.class);

	private final SessionFactory sessionFactory = getSessionFactory();

	protected SessionFactory getSessionFactory() {
		try {
			return (SessionFactory) new InitialContext()
					.lookup("SessionFactory");
		} catch (Exception e) {
			log.error("Could not locate SessionFactory in JNDI", e);
			throw new IllegalStateException(
					"Could not locate SessionFactory in JNDI");
		}
	}

	public void persist(Kardex transientInstance) {
		log.debug("persisting Kardex instance");
		try {
			sessionFactory.getCurrentSession().persist(transientInstance);
			log.debug("persist successful");
		} catch (RuntimeException re) {
			log.error("persist failed", re);
			throw re;
		}
	}

	public void attachDirty(Kardex instance) {
		log.debug("attaching dirty Kardex instance");
		try {
			sessionFactory.getCurrentSession().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(Kardex instance) {
		log.debug("attaching clean Kardex instance");
		try {
			sessionFactory.getCurrentSession().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void delete(Kardex persistentInstance) {
		log.debug("deleting Kardex instance");
		try {
			sessionFactory.getCurrentSession().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public Kardex merge(Kardex detachedInstance) {
		log.debug("merging Kardex instance");
		try {
			Kardex result = (Kardex) sessionFactory.getCurrentSession().merge(
					detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public Kardex findById(jmc.trazaweb.KardexId id) {
		log.debug("getting Kardex instance with id: " + id);
		try {
			Kardex instance = (Kardex) sessionFactory.getCurrentSession().get(
					"jmc.trazaweb.Kardex", id);
			if (instance == null) {
				log.debug("get successful, no instance found");
			} else {
				log.debug("get successful, instance found");
			}
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List<Kardex> findByExample(Kardex instance) {
		log.debug("finding Kardex instance by example");
		try {
			List<Kardex> results = (List<Kardex>) sessionFactory
					.getCurrentSession().createCriteria("jmc.trazaweb.Kardex")
					.add(create(instance)).list();
			log.debug("find by example successful, result size: "
					+ results.size());
			return results;
		} catch (RuntimeException re) {
			log.error("find by example failed", re);
			throw re;
		}
	}
}
